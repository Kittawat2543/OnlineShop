// var product = [
//   {
//     id: 1,
//     img: "./img/RC.jpg",
//     name: "RC",
//     price: 1500,
//     decscription:
//       "RC Lorem ipsum dolor sit amet consectetur adipisicing elit. In consectetur facere quas? Accusantium, est cupiditate?",
//     type: "undawn",
//   },
//   {
//     id: 2,
//     img: "./img/Jade.png",
//     name: "Gold",
//     price: 20000,
//     decscription:
//       "Gold Lorem ipsum dolor sit amet consectetur adipisicing elit. In consectetur facere quas? Accusantium, est cupiditate?",
//     type: "revelation",
//   },
//   {
//     id: 3,
//     img: "./img/shell.png",
//     name: "Garena Shell",
//     price: 300000,
//     decscription:
//       "Garena Shell Lorem ipsum dolor sit amet consectetur adipisicing elit. In consectetur facere quas? Accusantium, est cupiditate?",
//     type: "shell",
//   },
// ];

var product;

$(document).ready(() => {
  $.ajax({
    method: "get",
    url: "./api/getallproduct.php",
    success: function (response) {
      console.log(response);
      if (response.RespCode == 200) {
        product = response.Result;

        var html = "";
        for (let i = 0; i < product.length; i++) {
          html += `<div onclick="openProductDetail(${i})" class="product-items ${
            product[i].type
          }">
                <img class="product-img" src="./img/${product[i].img}" alt="" >
                <p style="font-size: 1.2vw">${product[i].name}</p>
                <p style="font-size: .9vw">${
                  numberWithCommas(product[i].price) + " THB"
                }</p>
              </div>`;
        }
        $("#productlist").html(html);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });

  // var html = "";
  // for (let i = 0; i < product.length; i++) {
  //   html += `<div onclick="openProductDetail(${i})" class="product-items ${
  //     product[i].type
  //   }">
  //               <img class="product-img" src="${product[i].img}" alt="" >
  //               <p style="font-size: 1.2vw">${product[i].name}</p>
  //               <p style="font-size: .9vw">${
  //                 numberWithCommas(product[i].price) + " THB"
  //               }</p>
  //             </div>`;
  // }
  // $("#productlist").html(html);
});

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}

function searchsomething(elem) {
  // console.log(elem.id)
  var value = $("#" + elem.id).val();
  console.log(value);

  var html = "";
  for (let i = 0; i < product.length; i++) {
    if (product[i].name.includes(value)) {
      html += `<div onclick="openProductDetail(${i})" class="product-items ${
        product[i].type
      }">
                <img class="product-img" src="./img/${product[i].img}" alt="" >
                <p style="font-size: 1.2vw">${product[i].name}</p>
                <p style="font-size: .9vw">${numberWithCommas(
                  product[i].price
                )}</p>
              </div>`;
    }
  }
  if (html == "") {
    $("#productlist").html(`<p>Not found products</p>`);
  } else {
    $("#productlist").html(html);
  }
}

function searchproduct(param) {
  console.log(param);
  $(".product-items").css("display", "none");

  if (param == "all") {
    $(".product-items").css("display", "block");
  } else {
    $("." + param).css("display", "block");
  }
}

var productindex = 0;
function openProductDetail(index) {
  productindex = index;
  console.log(productindex);
  $("#modalDesc").css("display", "flex");
  $("#mdd-img").attr("src", "./img/" + product[index].img);
  $("#mdd-name").text(product[index].name);
  $("#mdd-price").text(numberWithCommas(product[index].price) + " THB");
  $("#mdd-desc").text(product[index].decscription);
}

function closeModal() {
  $(".modal").css("display", "none");
}

var cart = [];
function addtocart() {
  var pass = true;

  for (let i = 0; i < cart.length; i++) {
    if (productindex == cart[i].index) {
      cart[i].count++;
      pass = false;
    }
  }

  if (pass) {
    var obj = {
      index: productindex,
      id: product[productindex].id,
      name: product[productindex].name,
      price: product[productindex].price,
      img: product[productindex].img,
      count: 1,
    };
    // console.log(obj)
    cart.push(obj);
  }
  console.log(cart);

  Swal.fire({
    icon: "success",
    title: "Add " + product[productindex].name + " to cart",
  });

  $("#cartcount").css("display", "flex").text(cart.length);
}

function opencart() {
  $("#modalCart").css("display", "flex");
  rendercart();
}

function rendercart() {
  if (cart.length > 0) {
    var html = "";
    for (let i = 0; i < cart.length; i++) {
      html += `<div class="cartlist-items">
            <div class="cartlist-left">
              <img
                src= "./img/${cart[i].img}"
                alt=""
              /> 

              <div class="cartlst-detail">
                <p style="font-size: 1.5vw">${cart[i].name}</p>
                <p style="font-size: 1.2 vw">${numberWithCommas(
                  cart[i].price * cart[i].count
                )} THB</p>
              </div>
            </div>
            <div class="cartlist-right">
              <p onclick="deinitems('-',${i})" class="btnc">-</p>
              <p id="countitems${i}" style="margin: 0 20px">${
        cart[i].count
      } </p>
              <p onclick="deinitems('+',${i})" class="btnc">+</p>
            </div>
          </div>`;
    }
    $("#mycart").html(html);
  } else {
    $("#mycart").html("<p>Not found product list</p>");
  }
}

function deinitems(action, index) {
  if (action == "-") {
    if (cart[index].count > 0) {
      cart[index].count--;
      $("#countitems" + index).text(cart[index].count);

      if (cart[index].count <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Are you sure yo delete",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        }).then((res) => {
          if (res.isConfirmed) {
            cart.splice(index, 1);
            console.log(cart);
            console.log("cart");
            rendercart();
            $("#cartcount").css("display", "flex").text(cart.length);

            if (cart.length <= 0) {
              $("#cartcount").css("display", "none");
            }
          } else {
            cart[index].count++;
            $("#countitems" + index).text(cart[index].count);
            rendercart();
          }
        });
      }
    }
  } else if (action == "+") {
    cart[index].count++;
    $("#countitems" + index).text(cart[index].count);
  }
}

function buynow() {
  $.ajax({
    method: "post",
    url: "./api/buynow.php",
    data: {
      product: cart,
    },
    success: function (response) {
      console.log(response);
      if (response.RespCode == 200) {
         Swal.fire({
           icon: "success",
           title: "Thank you",
           html: `<p>Amount : ${response.Amount.Amount}</p>
                  <p>Amount : ${response.Amount.Shippping}</p>
                  <p>Amount : ${response.Amount.Vat}</p>
                  <p>Amount : ${response.Amount.Netamount}</p>`,
         }).then((res) => {
           if (res.isConfirmed) {
             cart = [];
             closeModal();
             $("#cartcount").css('display','none')
           }
         })
      } else {
        Swal.fire({
          icon: "error",
          title: "Something is went wrong!",
        });
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}
