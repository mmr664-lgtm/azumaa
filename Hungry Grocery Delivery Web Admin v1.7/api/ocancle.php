<?php 
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
if($data['uid'] == '' or $data['oid'] == '')
{
    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
}
else
{
    $uid = strip_tags(mysqli_real_escape_string($con,$data['uid']));
    $oid = strip_tags(mysqli_real_escape_string($con,$data['oid']));
    $con->query("update orders set status='cancelled' where  id=".$oid." and uid=".$uid."");
	$fetch = $con->query("select * from orders where id=".$oid."")->fetch_assoc();
	if($fetch['p_method'] == 'Pickup Myself')
	{
	}
	else if($fetch['p_method'] == 'Cash On Delivery' and $fetch['wal_amt'] == 0)
	{
	}
	else if($fetch['p_method'] == 'Cash On Delivery' and $fetch['wal_amt'] != 0)
	{
		$wallet = $fetch['wal_amt'];
		 $con->query("update user set wallet = wallet+".$wallet." where id=".$uid."");
		 $con->query("insert into wallet_report(`uid`,`message`,`status`,`amt`)values(".$uid.",'Refund Order#'".$oid."' Amount To Wallet!!','Credit',".$wallet.")");
	}
	else 
	{
		$wallet = $fetch['total'];
		$con->query("update user set wallet = wallet+".$wallet." where id=".$uid."");
		 $con->query("insert into wallet_report(`uid`,`message`,`status`,`amt`)values(".$uid.",'Refund Order#'".$oid."' Amount To Wallet!!','Credit',".$wallet.")");
	}
    $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Order Cancle Successfully!");
    
}
echo json_encode($returnArr);