<?php

    require_once('./db.php');

    try {
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $object = new stdClass();
            $amount = 0;
            $product = $_POST['product'];
            
            $stmt = $db->prepare('select id,price from sp_product order by id desc');
            if($stmt->execute()){
                
                $queryproduct = array();

                while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        extract($row);
                        $items = array(
                            "id" => $id,
                            "price" => $price
                        );
                        array_push( $queryproduct, $items );
                }

                for ($i=0; $i < count($product) ; $i++) { 
                    for ($k=0; $k < count($queryproduct) ; $k++) { 
                        if( intval($product[$i]['id']) == intval($queryproduct[$k]['id']) ) {
                            $amount += intval($product[$i]['count']) * intval($queryproduct[$k]['price']);
                            break;
                        }
                    }                    
                }


                $shipping = $amount +  60;
                $vat = $shipping * 7 / 100;
                $netamount =  $shipping + $vat;
                $tranid = round(microtime(true) * 100);
                $product = json_encode($product);
                $mil = time()*1000;
                $updated_at = date("Y-m-d h:i:sa");  


                $stmt = $db->prepare("insert into sp_transaction (tranid,orderlist,amount,shipping,vat,netamount,operation,mil,updated_at) values (?,?,?,?,?,?,?,?,?)");
                if($stmt->execute([
                    $tranid,$product,$amount,$shipping,$vat,$netamount, 'PENDING', $mil,$updated_at
                ])) {
                    $object->RespCode = 200;
                    $object->RespMesssage = 'success';
                    $object->Amount = new stdclass();
                    $object->Amount->Amount = $amount; 
                    $object->Amount->Shippping = $shipping;
                    $object->Amount->Vat = $vat;
                    $object->Amount->Netamount = $netamount;

                    
                    http_response_code(200);
                
                }
                else {
                    $object->RespCode = 300;
                    $object->log = 0;
                    $object->RespMesssage = 'bad : insert transaction fail';
                    http_response_code(300);
                }
                            
            }
            else{
                $object->RespCode = 500;
                $object->log = 1;
                $object->RespMesssage = 'bad : cant get product';
                http_response_code(500);
            }
            echo json_encode($object);
        }
        else {
            http_response_code(405);
        }
    }
    catch(PEOException $e) {
        http_response_code(500);
        echo $e->getMessage();
    }

?>