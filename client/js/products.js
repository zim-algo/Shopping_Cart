const token = sessionStorage.getItem('app-session');
let username = '';
$(() => {
    if (!token) {
        location.assign('index.html');
    } else {
        username = token.split('-')[1];
        username = username[0].toUpperCase() + username.substring(1);
        $('#username').html(username);
        loadProducts();
    }

    displayCart(getCart());

    //logout
    $('#logoutBtn').on('click', (e) => {
        sessionStorage.clear();
        location.assign('index.html');
    });

    // Add to cart
    $(document).on('click', '.product', (e) => {
        const btn = $(e.currentTarget);
        const pid = btn.attr('pid');

        getProduct(pid).then((product) => {
            if (product.stock == 0) {
                alert('Product is out of stock');
            } else {
                let cart = getCart();
                if (!cart) {
                    cart = [];
                }

                if (!cart.some(i => i.productId == product.id)) {
                    let cartItem = {
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        total: product.price
                    };
                    cart.push(cartItem);
                } else {
                    const itemIndex = cart.findIndex(i => i.productId == product.id);
                    if (product.stock < cart[itemIndex].quantity + 1) {
                        alert('Quantity cannot exceed stock');
                    } else {
                        console.log(cart);

                        console.log(itemIndex);
                        cart[itemIndex].quantity += 1;
                        cart[itemIndex].total += product.price;
                    }
                }

                displayCart(cart);
                setCart(cart);
            }
        }).catch((error) => {
            console.log(error);
            alert(error);
        });

    });

    // increase quantity
    $(document).on('click', '.increase', (e) => {
        const btn = $(e.currentTarget);
        const input = $('#' + btn.attr('tid'));
        const qty = parseInt(input.val());
        const productId = parseInt(btn.attr('pid'));

        getProduct(productId).then((product) => {
            if (product.stock == 0) {
                alert('Product is out of stock');
            } else {
                let cart = getCart();

                const itemIndex = cart.findIndex(i => i.productId == productId);
                if (product.stock < cart[itemIndex].quantity + 1) {
                    alert('Quantity cannot exceed stock');
                } else {

                    cart[itemIndex].quantity += 1;
                    cart[itemIndex].total += cart[itemIndex].price;

                    displayCart(cart);
                    setCart(cart);
                }
            }
        }).catch((error) => {
            console.log(error);
            alert(error);
        });
    });

    // decrease quantity
    $(document).on('click', '.decrease', (e) => {
        const btn = $(e.currentTarget);
        const input = $('#' + btn.attr('tid'));
        const qty = parseInt(input.val());
        const productId = parseInt(btn.attr('pid'));

        let cart = getCart();

        const itemIndex = cart.findIndex(i => i.productId == productId);
        cart[itemIndex].quantity -= 1;
        cart[itemIndex].total -= cart[itemIndex].price;

        if (cart[itemIndex].quantity == 0) {
            cart.splice(itemIndex, 1);
        }

        displayCart(cart);
        setCart(cart);
    });

    $('#placeOrederBtn').on('click', (e) => {
        const cart = getCart();
        const orderItems = cart.map(i => ({ id: i.productId, quantity: i.quantity }));

        placeOrder(orderItems).then((message) => {
            alert(message);
            loadProducts();
            clearCart();
        }).catch((error) => {
            alert(error);
        });
    });
});

const loadProducts = function () {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/api/products',
        headers: { authorization: 'bearer ' + token },
        success: (response) => {
            console.log(response);
            fillProducts(response.data);
        },
        error: (error) => {
            console.log(error);
            alert(error.responseJSON.message ?? error.message);
        }
    })
}

const fillProducts = function (products) {
    let tbody = '';
    products.forEach((p, i) => {
        tbody += `<tr><td>${p.name}</td><td>${p.price}</td><td><img src="http://localhost:3001/public/images/${p.image}" style="width:100px;" /></td><td>${p.stock}</td><td><button class="btn btn-warning product" pid="${p.id}" title="Add to cart">  <i class="fa fa-cart-shopping"></i></button></td></tr>`;
    });
    $('#tbody').html(tbody);
}

const getProduct = function (pid) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3001/api/products/' + pid,
            headers: { authorization: 'bearer ' + token },
            success: (response) => {
                resolve(response.data);
            },
            error: (error) => {
                console.log(error);
                reject(error.responseJSON.message ?? error.message);
            }
        });
    });
}

const placeOrder = function (order) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3001/api/products/place-order',
            headers: { authorization: 'bearer ' + token },
            data: JSON.stringify(order),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: (response) => {
                console.log(response);
                resolve(response.message);
            },
            error: (error) => {
                console.log(error);
                reject(error.responseJSON.message ?? error.message);
            }
        })
    });
}

const getCart = function () {
    const cart = localStorage.getItem(username + '-cart');
    if (!cart) {
        return [];
    } else {
        return JSON.parse(cart)
    }
}

const setCart = function (cart) {
    const cartItems = JSON.stringify(cart);
    localStorage.setItem(username + '-cart', cartItems);
}

const clearCart = function () {
    setCart([]);
    const cart = getCart();
    displayCart(cart);
}

const displayCart = function (cart) {
    if (cart.length == 0) {
        $('#noItem').show();
        $('#hasItem').hide();
    } else {
        let cartBody = '';
        let total = 0;
        cart.forEach((item, i) => {
            cartBody += `<tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.total.toFixed(2)}</td>
        <td>
            <div class="input-group mb-3" style="width:100px !important;">
                <button class="btn btn-outline-secondary decrease" type="button" tid="qt${i}" pid="${item.productId}"><i class="fa fa-minus"></i></button>
                <input type="text" readonly class="form-control" value="${item.quantity}" id="qt${i}">
                <button class="btn btn-outline-secondary increase" type="button" tid="qt${i}" pid="${item.productId}"><i class="fa fa-plus"></i></button>
              </div>
        </td>
    </tr>`;
            total += item.total;
        });
        $('#cartBody').html(cartBody);
        $('#cartTotal').html(total.toFixed(2));

        $('#noItem').hide();
        $('#hasItem').show();
    }
}

