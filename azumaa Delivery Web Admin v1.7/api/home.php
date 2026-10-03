<?php 

require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
 
$uid = $data['uid'];
if($uid == '')
{
	$returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went wrong  try again !");
}
else 
{ 
	$v = array();
	$cp = array(); 
	$d = array();
	$p = array();
	$sec = array();
$sel = $con->query("select * from banner");
while($row = $sel->fetch_assoc())
{
    $v[] = $row;
}

$sels = $con->query("select * from category limit 6");
while($rows = $sels->fetch_assoc())
{
    $p['id'] = $rows['id'];
		$p['catname'] = $rows['catname'];
		$p['catimg'] = $rows['catimg'];
		$p['count'] = $con->query("select * from subcategory where cat_id=".$rows['id']."")->num_rows;
		$cp[] = $p;
}

$result = array();
$prod = $con->query("select * from product where status=1 and popular = 1 order by id desc limit 5 ");
	while($row = $prod->fetch_assoc())
	{
		$result['id'] = $row['id'];
		$result['cat_id'] = $row['cid'];
	$result['subcat_id'] = $row['sid'];
    $result['product_name'] = $row['pname'];
    $result['product_image'] = $row['pimg'];
	$result['product_related_image'] = $row['prel'];
    $result['seller_name'] = $row['sname'];
    $result['short_desc'] = $row['psdesc'];
	$result['mqty'] = $row['mqty'];
    $a = explode('$;',$row['pgms']);
    //print_r($a[0]);
    $ab = explode('$;',$row['fprice']);
    $k=array();
    for($i=0;$i<count($a);$i++)
    {
        $k[$i] = array("product_type"=>$a[$i],"product_price"=>$ab[$i]);
    }
    
    $result['price'] = $k;
	$result['discount'] = $row['discount'];
    $result['stock'] = $row['stock'];
    $d[] = $result;
	}
	

$slist = $con->query("select * from home where status = 1")->num_rows;
if($slist !=0)
{
    $plist = $con->query("select * from home where status = 1");
    
 $sev = array();
    while($rp = $plist->fetch_assoc())
    {
      $rpq =  $con->query("select * from product where status=1 and sid=".$rp['sid']." and cid=".$rp['cid']."  order by id desc");
      $section = array();
    $sep = array();
      while($rps = $rpq->fetch_assoc())
      {
        $section['id'] = $rps['id'];
		$section['cat_id'] = $rps['cid'];
	$section['subcat_id'] = $rps['sid'];
    $section['product_name'] = $rps['pname'];
    $section['product_image'] = $rps['pimg'];
	$section['product_related_image'] = $rps['prel'];
    $section['seller_name'] = $rps['sname'];
	$section['mqty'] = $rps['mqty'];
    $section['short_desc'] = $rps['psdesc'];
    $a = explode('$;',$rps['pgms']);
    //print_r($a[0]);
    $ab = explode('$;',$rps['pprice']);
    $k=array();
    for($i=0;$i<count($a);$i++)
    {
        $k[$i] = array("product_type"=>$a[$i],"product_price"=>$ab[$i]);
    }
    
    $section['price'] = $k;
	$section['discount'] = $rps['discount'];
    $section['stock'] = $rps['stock'];
    $sep[] = $section;
    }
    $sev['title'] = $rp['title'];
    $sev['product_data'] = $sep;
    $sec[] = $sev;
    }
}
else 
{
    
}

$date_check = date('Y-m-d H:i:s');

$kol = array();
$fdata = array();
$kks = array();

$get = $con->query("select * from tbl_sale where status=1 and expire=0");
while($row = $get->fetch_assoc())
{
	if($date_check >= $row['start_date'].' '.$row['start_time'])
	{
	if($date_check >= $row['end_date'].' '.$row['end_time'])
	{
		$con->query("update tbl_sale set status=0,expire=1 where id=".$row['id']."");
	}
	else 
	{
		$fdata['flashid'] = $row['id'];
        $fdata['name'] = $row['name'];	
        $fdata['enddatetime'] = $row['end_date'].' '.$row['end_time'];			
		$getitem = $con->query("select * from tbl_sale_item where saleid=".$row['id']."");
		$vps = array();
		while($pl = $getitem->fetch_assoc())
		{
			$rpq =  $con->query("select * from product where id IN(".$pl['pid'].") and stock=1 order by id desc");
      $section = array();
    $sep = array();
      while($rps = $rpq->fetch_assoc())
      {
        $section['id'] = $rps['id'];
		$section['cat_id'] = $rps['cid'];
	$section['subcat_id'] = $rps['sid'];
    $section['product_name'] = $rps['pname'];
    $section['product_image'] = $rps['pimg'];
	$section['product_related_image'] = $rps['prel'];
    $section['seller_name'] = $rps['sname'];
	$section['mqty'] = $rps['mqty'];
    $section['short_desc'] = $rps['psdesc'];
    $a = explode('$;',$rps['pgms']);
    //print_r($a[0]);
    $ab = explode('$;',$rps['fprice']);
    $k=array();
    for($i=0;$i<count($a);$i++)
    {
        $k[$i] = array("product_type"=>$a[$i],"product_price"=>$ab[$i]);
    }
    
    $section['price'] = $k;
	$section['discount'] = $rps['discount'];
    $section['stock'] = $rps['stock'];
    $sep[] = $section;
    }
		}
		$fdata['product_data'] = $sep;
		$kks[] = $fdata;
	}
	}
}
	$udata = $con->query("select * from user where id=".$uid."")->fetch_assoc();
	$date_time = $udata['rdate'];
	
$remain = $con->query("select * from noti where date >='".$date_time."'")->num_rows;

	
	$read = $con->query("select * from uread where uid=".$uid."")->num_rows;
	$r_noti = $remain - $read;
	$curr = $con->query("select * from setting")->fetch_assoc();
	$wallet = $con->query("select * from user where id=".$uid."")->fetch_assoc();
	$kp = array('Banner'=>$v,'Catlist'=>$cp,'Productlist'=>$d,"Remain_notification"=>$r_noti,"Main_Data"=>$curr,"dynamic_section"=>$sec,"Wallet"=>$wallet['wallet'],"Flashsalelist"=>$kks);
	
	$returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Data Get Successfully!","ResultData"=>$kp);
}
echo json_encode($returnArr);