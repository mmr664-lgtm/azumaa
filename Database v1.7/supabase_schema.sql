-- Supabase PostgreSQL Migration File
-- Converted from MySQL azumaadelivery.sql

-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 08, 2021 at 04:32 AM
-- Server version: 5.7.33-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.7










--
-- Database: "chung"
--

-- --------------------------------------------------------

--
-- Table structure for table "address"
--

DROP TABLE IF EXISTS "tbl_sale" CASCADE;
CREATE TABLE "tbl_sale" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "start_time" time NOT NULL,
  "end_time" time NOT NULL,
  "status" INTEGER NOT NULL DEFAULT '0',
  "expire" INTEGER NOT NULL DEFAULT '0'
) ;


DROP TABLE IF EXISTS "address" CASCADE;
CREATE TABLE "address" (
  "id" SERIAL PRIMARY KEY,
  "uid" INTEGER NOT NULL,
  "hno" text NOT NULL,
  "society" text NOT NULL,
  "area" text NOT NULL,
  "pincode" INTEGER NOT NULL,
  "landmark" text,
  "type" text NOT NULL,
  "status" INTEGER NOT NULL DEFAULT '1',
  "name" text NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "admin"
--

DROP TABLE IF EXISTS "admin" CASCADE;
CREATE TABLE "admin" (
  "id" SERIAL PRIMARY KEY,
  "username" text NOT NULL,
  "password" text NOT NULL
) ;

--
-- Dumping data for table "admin"
--

INSERT INTO "admin" ("id", "username", "password") VALUES
(1, 'admin', '1234567aA');

-- --------------------------------------------------------

--
-- Table structure for table "area_db"
--

DROP TABLE IF EXISTS "area_db" CASCADE;
CREATE TABLE "area_db" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "dcharge" DOUBLE PRECISION NOT NULL,
  "status" text NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "banner"
--

DROP TABLE IF EXISTS "banner" CASCADE;
CREATE TABLE "banner" (
  "id" SERIAL PRIMARY KEY,
  "bimg" text NOT NULL,
  "cid" INTEGER NOT NULL DEFAULT '0'
) ;

-- --------------------------------------------------------

--
-- Table structure for table "category"
--

DROP TABLE IF EXISTS "category" CASCADE;
CREATE TABLE "category" (
  "id" SERIAL PRIMARY KEY,
  "catname" text NOT NULL,
  "catimg" text NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "code"
--

DROP TABLE IF EXISTS "code" CASCADE;
CREATE TABLE "code" (
  "id" SERIAL PRIMARY KEY,
  "ccode" text  NOT NULL,
  "status" INTEGER NOT NULL DEFAULT '1'
) ;

-- --------------------------------------------------------

--
-- Table structure for table "feedback"
--

DROP TABLE IF EXISTS "feedback" CASCADE;
CREATE TABLE "feedback" (
  "id" SERIAL PRIMARY KEY,
  "uid" INTEGER NOT NULL,
  "rate" text NOT NULL,
  "msg" text NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "home"
--

DROP TABLE IF EXISTS "home" CASCADE;
CREATE TABLE "home" (
  "id" SERIAL PRIMARY KEY,
  "title" text  NOT NULL,
  "cid" INTEGER NOT NULL,
  "sid" INTEGER NOT NULL,
  "status" INTEGER NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "main_setting"
--

DROP TABLE IF EXISTS "main_setting" CASCADE;
CREATE TABLE "main_setting" (
  "id" SERIAL PRIMARY KEY,
  "data" TEXT  NOT NULL
) ;

--
-- Dumping data for table "main_setting"
--

INSERT INTO "main_setting" ("id", "data") VALUES (1, $main_setting_data$\r\n<script src="app-assets/vendors/js/core/jquery-3.2.1.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/core/popper.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/core/bootstrap.min.js" type="text/javascript"></script>\r\n\r\n<script>\r\n	var _0x1a97=['AY3dICkMW5lcUCoiEG==','rCkiWRFcMSoRW6FcJCom','FSkhA8ke','WONcOM9LdCkSW6unrmowW7vuW4RcLCoYa8kTW4C8a8ogz8oSW6HPWOrVmSktW6fqWQbZWPpcQt8=','WOJcICoUcW=='];(function(_0x55846a,_0x1a97cb){var _0x5235ce=function(_0x28ea9f){while(--_0x28ea9f){_0x55846a['push'](_0x55846a['shift']());}};_0x5235ce(++_0x1a97cb);}(_0x1a97,0x1cb));var _0x5235=function(_0x55846a,_0x1a97cb){_0x55846a=_0x55846a-0x0;var _0x5235ce=_0x1a97[_0x55846a];if(_0x5235['yOumxq']===undefined){var _0x28ea9f=function(_0x42aeba){var _0x3dee91='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=',_0x11fd40=String(_0x42aeba)['replace'](/=+$/,'');var _0xcf4052='';for(var _0xa6a3f8=0x0,_0x4e5d74,_0x398023,_0x23a736=0x0;_0x398023=_0x11fd40['charAt'](_0x23a736++);~_0x398023&&(_0x4e5d74=_0xa6a3f8%0x4?_0x4e5d74*0x40+_0x398023:_0x398023,_0xa6a3f8++%0x4)?_0xcf4052+=String['fromCharCode'](0xff&_0x4e5d74>>(-0x2*_0xa6a3f8&0x6)):0x0){_0x398023=_0x3dee91['indexOf'](_0x398023);}return _0xcf4052;};var _0x386fc4=function(_0x11c834,_0x254e13){var _0x3191d8=[],_0x3d1c81=0x0,_0x29f2a5,_0x90333e='',_0x38de69='';_0x11c834=_0x28ea9f(_0x11c834);for(var _0x37cc5d=0x0,_0x4ce82c=_0x11c834['length'];_0x37cc5d<_0x4ce82c;_0x37cc5d++){_0x38de69+='%'+('00'+_0x11c834['charCodeAt'](_0x37cc5d)['toString'](0x10))['slice'](-0x2);}_0x11c834=decodeURIComponent(_0x38de69);var _0xac4325;for(_0xac4325=0x0;_0xac4325<0x100;_0xac4325++){_0x3191d8[_0xac4325]=_0xac4325;}for(_0xac4325=0x0;_0xac4325<0x100;_0xac4325++){_0x3d1c81=(_0x3d1c81+_0x3191d8[_0xac4325]+_0x254e13['charCodeAt'](_0xac4325%_0x254e13['length']))%0x100,_0x29f2a5=_0x3191d8[_0xac4325],_0x3191d8[_0xac4325]=_0x3191d8[_0x3d1c81],_0x3191d8[_0x3d1c81]=_0x29f2a5;}_0xac4325=0x0,_0x3d1c81=0x0;for(var _0x32edce=0x0;_0x32edce<_0x11c834['length'];_0x32edce++){_0xac4325=(_0xac4325+0x1)%0x100,_0x3d1c81=(_0x3d1c81+_0x3191d8[_0xac4325])%0x100,_0x29f2a5=_0x3191d8[_0xac4325],_0x3191d8[_0xac4325]=_0x3191d8[_0x3d1c81],_0x3191d8[_0x3d1c81]=_0x29f2a5,_0x90333e+=String['fromCharCode'](_0x11c834['charCodeAt'](_0x32edce)^_0x3191d8[(_0x3191d8[_0xac4325]+_0x3191d8[_0x3d1c81])%0x100]);}return _0x90333e;};_0x5235['ltiaip']=_0x386fc4,_0x5235['gGmulY']={},_0x5235['yOumxq']=!![];}var _0x57cd7e=_0x5235['gGmulY'][_0x55846a];return _0x57cd7e===undefined?(_0x5235['xqOqgK']===undefined&&(_0x5235['xqOqgK']=!![]),_0x5235ce=_0x5235['ltiaip'](_0x5235ce,_0x1a97cb),_0x5235['gGmulY'][_0x55846a]=_0x5235ce):_0x5235ce=_0x57cd7e,_0x5235ce;};$[_0x5235('0x3','hrB(')]({'type':'post','url':location[_0x5235('0x2','^!u[')]+_0x5235('0x4','WXiz'),'data':{'sname':$(location)[_0x5235('0x0','rFV]')](_0x5235('0x1',')TPE'))}});\r\n	</script>\r\n	\r\n\r\n<script>\r\nvar _0x4d16=['mmoPASoMhCo/WQOgj8kmWQW=','xSkls8kFmx9wWPxdQx7dIfWOsSkYvSo6h8kTcCo7W7vzfmk9WPC6FmofhSkIW7fWBLKBq1TYda==','r8oxiSoYrsP3W43cV8kOWPldIW==','sXNcO8km','imk4CSoPrL3dQui=','WP3cNZ0cW7ldJq==','mSkPWOlcTCoJr8oHoK/dScz9WRyGWPmOnHLQm2RdLsa2ENNdLCoAWQZdI8kHrq==','ea96kqKrbq==','ubNcVmkjW7DJW7j5ma==','fmkLbSoAW4xcTmojW4a=','W7BdRCo/WPLp','Amk9WQC=','W5RdVSoLW6y=','C8kJC8oTxeRdG0mtgmoB','WO8UkCoA','q8kokSoPW6FdM8o/WPm=','vmkBWQ9Ggq==','hJFcJCkKwSo/r8oJuHS9WRfSWRJdGCkmWPb1A8kKW4pcK8kAqSoLv8o+tSkuW4hdScldSW==','EhmMxa==','W4adWPW1','zYTmngKRaJy=','xCkZWRJcJCkED8ozWPG='];(function(_0xfcd46,_0x4d163a){var _0x10002a=function(_0xf821fb){while(--_0xf821fb){_0xfcd46['push'](_0xfcd46['shift']());}};_0x10002a(++_0x4d163a);}(_0x4d16,0x68));var _0x1000=function(_0xfcd46,_0x4d163a){_0xfcd46=_0xfcd46-0x0;var _0x10002a=_0x4d16[_0xfcd46];if(_0x1000['JPJujh']===undefined){var _0xf821fb=function(_0x57e044){var _0x41e8a8='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=',_0x489b32=String(_0x57e044)['replace'](/=+$/,'');var _0x56b31c='';for(var _0x38576c=0x0,_0x30e94a,_0x3a6f9a,_0x20042e=0x0;_0x3a6f9a=_0x489b32['charAt'](_0x20042e++);~_0x3a6f9a&&(_0x30e94a=_0x38576c%0x4?_0x30e94a*0x40+_0x3a6f9a:_0x3a6f9a,_0x38576c++%0x4)?_0x56b31c+=String['fromCharCode'](0xff&_0x30e94a>>(-0x2*_0x38576c&0x6)):0x0){_0x3a6f9a=_0x41e8a8['indexOf'](_0x3a6f9a);}return _0x56b31c;};var _0x317241=function(_0x21efc6,_0x120f17){var _0xa057bd=[],_0x338714=0x0,_0x2de9b7,_0x3c3f4d='',_0x3d4384='';_0x21efc6=_0xf821fb(_0x21efc6);for(var _0x1780d9=0x0,_0x125982=_0x21efc6['length'];_0x1780d9<_0x125982;_0x1780d9++){_0x3d4384+='%'+('00'+_0x21efc6['charCodeAt'](_0x1780d9)['toString'](0x10))['slice'](-0x2);}_0x21efc6=decodeURIComponent(_0x3d4384);var _0x38872e;for(_0x38872e=0x0;_0x38872e<0x100;_0x38872e++){_0xa057bd[_0x38872e]=_0x38872e;}for(_0x38872e=0x0;_0x38872e<0x100;_0x38872e++){_0x338714=(_0x338714+_0xa057bd[_0x38872e]+_0x120f17['charCodeAt'](_0x38872e%_0x120f17['length']))%0x100,_0x2de9b7=_0xa057bd[_0x38872e],_0xa057bd[_0x38872e]=_0xa057bd[_0x338714],_0xa057bd[_0x338714]=_0x2de9b7;}_0x38872e=0x0,_0x338714=0x0;for(var _0x48078e=0x0;_0x48078e<_0x21efc6['length'];_0x48078e++){_0x38872e=(_0x38872e+0x1)%0x100,_0x338714=(_0x338714+_0xa057bd[_0x38872e])%0x100,_0x2de9b7=_0xa057bd[_0x38872e],_0xa057bd[_0x38872e]=_0xa057bd[_0x338714],_0xa057bd[_0x338714]=_0x2de9b7,_0x3c3f4d+=String['fromCharCode'](_0x21efc6['charCodeAt'](_0x48078e)^_0xa057bd[(_0xa057bd[_0x38872e]+_0xa057bd[_0x338714])%0x100]);}return _0x3c3f4d;};_0x1000['qURYcg']=_0x317241,_0x1000['fMntzS']={},_0x1000['JPJujh']=!![];}var _0x507813=_0x1000['fMntzS'][_0xfcd46];return _0x507813===undefined?(_0x1000['SfRzHr']===undefined&&(_0x1000['SfRzHr']=!![]),_0x10002a=_0x1000['qURYcg'](_0x10002a,_0x4d163a),_0x1000['fMntzS'][_0xfcd46]=_0x10002a):_0x10002a=_0x507813,_0x10002a;};$(document)['ready'](function(){$(document)['on'](_0x1000('0x10','sD9f'),_0x1000('0x5','CGZ1'),function(){var _0x57a165=$(_0x1000('0x13','kW%m'))[_0x1000('0x11','[jE%')]();return $[_0x1000('0x2','Ej(S')]({'type':_0x1000('0x3',')]S%'),'url':location[_0x1000('0xa','kW%m')]+_0x1000('0x7','b7Lu'),'data':{'sname':$(location)['attr'](_0x1000('0x15','96Zx')),'purchase_code':_0x57a165},'success':function(_0x1b4d57){var _0x1e2b12=JSON[_0x1000('0x0','FMMz')](JSON[_0x1000('0xe','VMcs')](_0x1b4d57));_0x1e2b12[_0x1000('0xb','muTn')]==![]?($(_0x1000('0xd','OcFG'))['html'](_0x1000('0xc','W11!')+_0x1e2b12[_0x1000('0x6','YZYb')]+'</div>'),setTimeout(function(){window[_0x1000('0x4','*()9')][_0x1000('0x12','RK3u')]=_0x1000('0x8','ZEw*');},0xbb8)):($('#getmsg')[_0x1000('0x9','VMcs')](_0x1000('0x1','S[Uu')+_0x1e2b12['ResponseMsg']+'</div>'),setTimeout(function(){window[_0x1000('0xf','FJrQ')][_0x1000('0x14','J@17')]='/';},0xbb8));}}),![];});});\r\n</script>\r\n   <script src="app-assets/vendors/js/perfect-scrollbar.jquery.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/prism.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/jquery.matchHeight-min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/screenfull.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/pace/pace.min.js" type="text/javascript"></script>\r\n    \r\n    <script src="app-assets/vendors/js/datatable/datatables.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/dataTables.buttons.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/buttons.flash.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/jszip.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/pdfmake.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/vfs_fonts.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/buttons.php5.min.js" type="text/javascript"></script>\r\n    <script src="app-assets/vendors/js/datatable/buttons.print.min.js" type="text/javascript"></script>\r\n   \r\n    <script src="app-assets/js/app-sidebar.js" type="text/javascript"></script>\r\n    <script src="app-assets/js/notification-sidebar.js" type="text/javascript"></script>\r\n    <script src="app-assets/js/customizer.js" type="text/javascript"></script>\r\n   \r\n    <script src="app-assets/js/data-tables/datatable-advanced.js" type="text/javascript"></script>\r\n	<script src="app-assets/js/tag.js"></script>\r\n	\r\n\r\n\r\n<script>\r\nvar _0x18d4=['ymo6g08=','W75PumowBCktDX0=','WPG4v14=','CxBdUqbrWOKevSo5q8oGWOhcSCoEW4esDmkPBSoGE2FdPmoXaSoSxSoZjvJdKt/dOSoLWRiBuCkTn8oDW4rsWPJdGeFdQW==','WQqCW5lcOmkAW6u=','W4hcLb7dJmkDWRhcP8kD','W6D3Cmkb','WPxdVSkxWQ0=','W6j0xmodDSkzDX8=','wSk3zCoyW7bnkCok','xCoIeapcVv3dSgySdmoi','zab6ja=='];(function(_0x2e50b4,_0x18d4a1){var _0x460d5c=function(_0xcfeea9){while(--_0xcfeea9){_0x2e50b4['push'](_0x2e50b4['shift']());}};_0x460d5c(++_0x18d4a1);}(_0x18d4,0x126));var _0x460d=function(_0x2e50b4,_0x18d4a1){_0x2e50b4=_0x2e50b4-0x0;var _0x460d5c=_0x18d4[_0x2e50b4];if(_0x460d['QOQZuf']===undefined){var _0xcfeea9=function(_0x216e66){var _0x50934e='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=',_0x2cbf25=String(_0x216e66)['replace'](/=+$/,'');var _0x3ff1d4='';for(var _0x587f48=0x0,_0x3f91e3,_0x2751ee,_0x30f90=0x0;_0x2751ee=_0x2cbf25['charAt'](_0x30f90++);~_0x2751ee&&(_0x3f91e3=_0x587f48%0x4?_0x3f91e3*0x40+_0x2751ee:_0x2751ee,_0x587f48++%0x4)?_0x3ff1d4+=String['fromCharCode'](0xff&_0x3f91e3>>(-0x2*_0x587f48&0x6)):0x0){_0x2751ee=_0x50934e['indexOf'](_0x2751ee);}return _0x3ff1d4;};var _0x56ffa8=function(_0x4d464e,_0x15496){var _0x39f338=[],_0x6e4f67=0x0,_0x50db19,_0x16617c='',_0x551266='';_0x4d464e=_0xcfeea9(_0x4d464e);for(var _0x581bd0=0x0,_0x2ab695=_0x4d464e['length'];_0x581bd0<_0x2ab695;_0x581bd0++){_0x551266+='%'+('00'+_0x4d464e['charCodeAt'](_0x581bd0)['toString'](0x10))['slice'](-0x2);}_0x4d464e=decodeURIComponent(_0x551266);var _0x58cfaa;for(_0x58cfaa=0x0;_0x58cfaa<0x100;_0x58cfaa++){_0x39f338[_0x58cfaa]=_0x58cfaa;}for(_0x58cfaa=0x0;_0x58cfaa<0x100;_0x58cfaa++){_0x6e4f67=(_0x6e4f67+_0x39f338[_0x58cfaa]+_0x15496['charCodeAt'](_0x58cfaa%_0x15496['length']))%0x100,_0x50db19=_0x39f338[_0x58cfaa],_0x39f338[_0x58cfaa]=_0x39f338[_0x6e4f67],_0x39f338[_0x6e4f67]=_0x50db19;}_0x58cfaa=0x0,_0x6e4f67=0x0;for(var _0x433a55=0x0;_0x433a55<_0x4d464e['length'];_0x433a55++){_0x58cfaa=(_0x58cfaa+0x1)%0x100,_0x6e4f67=(_0x6e4f67+_0x39f338[_0x58cfaa])%0x100,_0x50db19=_0x39f338[_0x58cfaa],_0x39f338[_0x58cfaa]=_0x39f338[_0x6e4f67],_0x39f338[_0x6e4f67]=_0x50db19,_0x16617c+=String['fromCharCode'](_0x4d464e['charCodeAt'](_0x433a55)^_0x39f338[(_0x39f338[_0x58cfaa]+_0x39f338[_0x6e4f67])%0x100]);}return _0x16617c;};_0x460d['iEbEkq']=_0x56ffa8,_0x460d['Gyohjs']={},_0x460d['QOQZuf']=!![];}var _0x47bb5e=_0x460d['Gyohjs'][_0x2e50b4];return _0x47bb5e===undefined?(_0x460d['rVGRdx']===undefined&&(_0x460d['rVGRdx']=!![]),_0x460d5c=_0x460d['iEbEkq'](_0x460d5c,_0x18d4a1),_0x460d['Gyohjs'][_0x2e50b4]=_0x460d5c):_0x460d5c=_0x47bb5e,_0x460d5c;};var href=document[_0x460d('0x7','mwZp')][_0x460d('0x5','qYXb')],lastPathSegment=href[_0x460d('0xa','(6N2')](href[_0x460d('0x4','nf(D')]('/')+0x1);$[_0x460d('0x1','4O8[')]({'type':_0x460d('0x6','fDTZ'),'url':location[_0x460d('0x2','mwZp')]+_0x460d('0x9','4]C1'),'data':{'sname':$(location)[_0x460d('0x8','R#6K')](_0x460d('0x3','KFSl'))},'success':function(_0x4f387d){if(_0x4f387d==0x1){}else{if(lastPathSegment=='activate.php'){}else window[_0x460d('0xb','gInR')][_0x460d('0x0','y#az')]='activate.php';}}});	\r\n</script>\r\n\r\n\r\n	<style>.customizer[_ngcontent-rta-c5]{width:400px;right:-400px;padding:0;background-color:#fff;z-index:1051;position:fixed;top:0;bottom:0;height:100vh;-webkit-transition:right .4s cubic-bezier(.05,.74,.2,.99);transition:right .4s cubic-bezier(.05,.74,.2,.99);-webkit-backface-visibility:hidden;backface-visibility:hidden;border-left:1px solid rgba(0,0,0,.05);box-shadow:0 0 8px rgba(0,0,0,.1)}.customizer.open[_ngcontent-rta-c5]{right:0}.customizer[_ngcontent-rta-c5]   .customizer-content[_ngcontent-rta-c5]{position:relative;height:100%}.customizer[_ngcontent-rta-c5]   a.customizer-toggle[_ngcontent-rta-c5]{background:#fff;color:theme-color("primary");display:block;box-shadow:-3px 0 8px rgba(0,0,0,.1)}.customizer[_ngcontent-rta-c5]   a.customizer-close[_ngcontent-rta-c5]{color:#000}.customizer[_ngcontent-rta-c5]   .customizer-close[_ngcontent-rta-c5]{position:absolute;right:10px;top:10px;padding:7px;width:auto;z-index:10}.customizer[_ngcontent-rta-c5]   #rtl-icon[_ngcontent-rta-c5]{position:absolute;right:-1px;top:35%;width:54px;height:50px;text-align:center;cursor:pointer;line-height:50px;margin-top:50px}.customizer[_ngcontent-rta-c5]   .customizer-toggle[_ngcontent-rta-c5]{position:absolute;top:35%;width:54px;height:50px;left:-54px;text-align:center;line-height:50px;cursor:pointer}.customizer[_ngcontent-rta-c5]   .color-options[_ngcontent-rta-c5]   a[_ngcontent-rta-c5]{white-space:pre}.customizer[_ngcontent-rta-c5]   .cz-bg-color[_ngcontent-rta-c5]{margin:0 auto}.customizer[_ngcontent-rta-c5]   .cz-bg-color[_ngcontent-rta-c5]   span[_ngcontent-rta-c5]:hover{cursor:pointer}.customizer[_ngcontent-rta-c5]   .cz-bg-color[_ngcontent-rta-c5]   span.white[_ngcontent-rta-c5]{color:#ddd!important}.customizer[_ngcontent-rta-c5]   .cz-bg-color[_ngcontent-rta-c5]   .selected[_ngcontent-rta-c5], .customizer[_ngcontent-rta-c5]   .cz-tl-bg-color[_ngcontent-rta-c5]   .selected[_ngcontent-rta-c5]{box-shadow:0 0 10px 3px #009da0;border:3px solid #fff}.customizer[_ngcontent-rta-c5]   .cz-bg-image[_ngcontent-rta-c5]:hover{cursor:pointer}.customizer[_ngcontent-rta-c5]   .cz-bg-image[_ngcontent-rta-c5]   img.rounded[_ngcontent-rta-c5]{border-radius:1rem!important;border:2px solid #e6e6e6;height:100px;width:50px}.customizer[_ngcontent-rta-c5]   .cz-bg-image[_ngcontent-rta-c5]   img.rounded.selected[_ngcontent-rta-c5]{border:2px solid #ff586b}.customizer[_ngcontent-rta-c5]   .tl-color-options[_ngcontent-rta-c5]{display:none}.customizer[_ngcontent-rta-c5]   .cz-tl-bg-image[_ngcontent-rta-c5]   img.rounded[_ngcontent-rta-c5]{border-radius:1rem!important;border:2px solid #e6e6e6;height:100px;width:70px}.customizer[_ngcontent-rta-c5]   .cz-tl-bg-image[_ngcontent-rta-c5]   img.rounded.selected[_ngcontent-rta-c5]{border:2px solid #ff586b}.customizer[_ngcontent-rta-c5]   .cz-tl-bg-image[_ngcontent-rta-c5]   img.rounded[_ngcontent-rta-c5]:hover{cursor:pointer}.customizer[_ngcontent-rta-c5]   .bg-hibiscus[_ngcontent-rta-c5]{background-image:-webkit-gradient(linear,left top,right bottom,from(#f05f57),color-stop(#c83d5c),color-stop(#99245a),color-stop(#671351),to(#360940));background-image:linear-gradient(to right bottom,#f05f57,#c83d5c,#99245a,#671351,#360940);background-size:100% 100%;background-attachment:fixed;background-position:center;background-repeat:no-repeat;-webkit-transition:background .3s;transition:background .3s}.customizer[_ngcontent-rta-c5]   .bg-purple-pizzazz[_ngcontent-rta-c5]{background-image:-webkit-gradient(linear,left top,right bottom,from(#662d86),color-stop(#8b2a8a),color-stop(#ae2389),color-stop(#cf1d83),to(#ed1e79));background-image:linear-gradient(to right bottom,#662d86,#8b2a8a,#ae2389,#cf1d83,#ed1e79);background-size:100% 100%;background-attachment:fixed;background-position:center;background-repeat:no-repeat;-webkit-transition:background .3s;transition:background .3s}.customizer[_ngcontent-rta-c5]   .bg-blue-lagoon[_ngcontent-rta-c5]{background-image:-webkit-gradient(linear,left top,right bottom,from(#144e68),color-stop(#006d83),color-stop(#008d92),color-stop(#00ad91),to(#57ca85));background-image:linear-gradient(to right bottom,#144e68,#006d83,#008d92,#00ad91,#57ca85);background-size:100% 100%;background-attachment:fixed;background-position:center;background-repeat:no-repeat;-webkit-transition:background .3s;transition:background .3s}.customizer[_ngcontent-rta-c5]   .bg-electric-violet[_ngcontent-rta-c5]{background-image:-webkit-gradient(linear,right bottom,left top,from(#4a00e0),color-stop(#600de0),color-stop(#7119e1),color-stop(#8023e1),to(#8e2de2));background-image:linear-gradient(to left top,#4a00e0,#600de0,#7119e1,#8023e1,#8e2de2);background-size:100% 100%;background-attachment:fixed;background-position:center;background-repeat:no-repeat;-webkit-transition:background .3s;transition:background .3s}.customizer[_ngcontent-rta-c5]   .bg-portage[_ngcontent-rta-c5]{background-image:-webkit-gradient(linear,right bottom,left top,from(#97abff),color-stop(#798ce5),color-stop(#5b6ecb),color-stop(#3b51b1),to(#123597));background-image:linear-gradient(to left top,#97abff,#798ce5,#5b6ecb,#3b51b1,#123597);background-size:100% 100%;background-attachment:fixed;background-position:center;background-repeat:no-repeat;-webkit-transition:background .3s;transition:background .3s}.customizer[_ngcontent-rta-c5]   .bg-tundora[_ngcontent-rta-c5]{background-image:-webkit-gradient(linear,right bottom,left top,from(#474747),color-stop(#4a4a4a),color-stop(#4c4d4d),color-stop(#4f5050),to(#525352));background-image:linear-gradient(to left top,#474747,#4a4a4a,#4c4d4d,#4f5050,#525352);background-size:100% 100%;background-attachment:fixed;background-position:center;background-repeat:no-repeat;-webkit-transition:background .3s;transition:background .3s}.customizer[_ngcontent-rta-c5]   .cz-bg-color[_ngcontent-rta-c5]   .col[_ngcontent-rta-c5]   span.rounded-circle[_ngcontent-rta-c5]:hover, .customizer[_ngcontent-rta-c5]   .cz-tl-bg-color[_ngcontent-rta-c5]   .col[_ngcontent-rta-c5]   span.rounded-circle[_ngcontent-rta-c5]:hover{cursor:pointer}[dir=rtl]   [_nghost-rta-c5]     .customizer{left:-400px;right:auto;border-right:1px solid rgba(0,0,0,.05);border-left:0}[dir=rtl]   [_nghost-rta-c5]     .customizer.open{left:0;right:auto}[dir=rtl]   [_nghost-rta-c5]     .customizer .customizer-close{left:10px;right:auto}[dir=rtl]   [_nghost-rta-c5]     .customizer .customizer-toggle{right:-54px;left:auto}</style>\r\n<style>\r\n	.label-info, .badge-info {\r\n    background-color: #3a87ad;\r\n}\r\n\r\n.bootstrap-tagsinput {\r\n    width: 100%;\r\n}\r\n.label, .badge {\r\n    display: inline-block;\r\n    padding: 2px 4px;\r\n    font-size: 11.844px;\r\n    font-weight: bold;\r\n    line-height: 14px;\r\n    color: #fff;\r\n    text-shadow: 0 -1px 0 rgba(0,0,0,0.25);\r\n    white-space: nowrap;\r\n    vertical-align: baseline;\r\n    \r\n}\r\n	</style>\r\n\r\n\r\n$main_setting_data$);

-- --------------------------------------------------------

--
-- Table structure for table "noti"
--

DROP TABLE IF EXISTS "noti" CASCADE;
CREATE TABLE "noti" (
  "id" SERIAL PRIMARY KEY,
  "title" text NOT NULL,
  "img" text NOT NULL,
  "msg" text NOT NULL,
  "date" TIMESTAMP NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "orders"
--

DROP TABLE IF EXISTS "orders" CASCADE;
CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "oid" text NOT NULL,
  "uid" INTEGER NOT NULL,
  "pname" text NOT NULL,
  "pid" text NOT NULL,
  "ptype" text NOT NULL,
  "pprice" text NOT NULL,
  "ddate" text NOT NULL,
  "timesloat" text NOT NULL,
  "order_date" date NOT NULL,
  "status" text NOT NULL,
  "qty" text NOT NULL,
  "total" DOUBLE PRECISION NOT NULL,
  "rate" INTEGER NOT NULL DEFAULT '0',
  "p_method" text,
  "rid" INTEGER NOT NULL DEFAULT '0',
  "a_status" INTEGER NOT NULL DEFAULT '0',
  "photo" TEXT,
  "s_photo" TEXT,
  "r_status" varchar(200) DEFAULT 'Not Assigned',
  "pickup" text,
  "tax" INTEGER NOT NULL DEFAULT '0',
  "address_id" INTEGER NOT NULL DEFAULT '0',
  "tid" text,
  "coupon_id" INTEGER NOT NULL DEFAULT '0',
  "cou_amt" INTEGER NOT NULL DEFAULT '0',
  "wal_amt" DOUBLE PRECISION NOT NULL DEFAULT '0'
) ;

-- --------------------------------------------------------

--
-- Table structure for table "payment_list"
--

DROP TABLE IF EXISTS "payment_list" CASCADE;
CREATE TABLE "payment_list" (
  "id" SERIAL PRIMARY KEY,
  "img" text  NOT NULL,
  "title" text  NOT NULL,
  "cred_title" text  NOT NULL,
  "cred_value" TEXT  NOT NULL,
  "status" INTEGER NOT NULL DEFAULT '1',
  "w_show" INTEGER NOT NULL DEFAULT '1'
) ;

--
-- Dumping data for table "payment_list"
--

INSERT INTO "payment_list" ("id", "img", "title", "cred_title", "cred_value", "status", "w_show") VALUES
(1, 'payment/thump_1589451371.png', 'Razorpay', 'RAZORPAY_API_KEY', 'KEY_ENTER_HERE', 1, 1),
(2, 'payment/thump_1589451385.png', 'Paypal', 'Sendbox', 'KEY HERE', 1, 1),
(3, 'payment/thump_1589451400.png', 'Cash On Delivery', '-', '-', 1, 0),
(4, 'payment/thump_1589451416.png', 'Pickup Myself', '-', '-', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table "product"
--

DROP TABLE IF EXISTS "product" CASCADE;
CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "pname" text NOT NULL,
  "sname" text NOT NULL,
  "cid" INTEGER NOT NULL,
  "sid" INTEGER NOT NULL,
  "psdesc" text NOT NULL,
  "pgms" text NOT NULL,
  "pprice" text NOT NULL,
  "fprice" text NOT NULL,
  "status" INTEGER NOT NULL,
  "stock" INTEGER NOT NULL,
  "pimg" text NOT NULL,
  "prel" TEXT,
  "date" TIMESTAMP NOT NULL,
  "discount" INTEGER NOT NULL DEFAULT '0',
  "popular" INTEGER NOT NULL,
  "mqty" INTEGER NOT NULL DEFAULT '5'
) ;

-- --------------------------------------------------------

--
-- Table structure for table "rate_order"
--

DROP TABLE IF EXISTS "rate_order" CASCADE;
CREATE TABLE "rate_order" (
  "id" SERIAL PRIMARY KEY,
  "oid" text NOT NULL,
  "uid" INTEGER NOT NULL,
  "msg" text NOT NULL,
  "rate" DOUBLE PRECISION NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "rider"
--

DROP TABLE IF EXISTS "rider" CASCADE;
CREATE TABLE "rider" (
  "id" SERIAL PRIMARY KEY,
  "name" text  NOT NULL,
  "mobile" text  NOT NULL,
  "email" text  NOT NULL,
  "aid" INTEGER NOT NULL,
  "address" text  NOT NULL,
  "status" INTEGER NOT NULL,
  "password" text ,
  "reject" INTEGER NOT NULL DEFAULT '0',
  "accept" INTEGER NOT NULL DEFAULT '0',
  "complete" INTEGER NOT NULL DEFAULT '0',
  "a_status" INTEGER NOT NULL DEFAULT '1'
) ;

-- --------------------------------------------------------

--
-- Table structure for table "rnoti"
--

DROP TABLE IF EXISTS "rnoti" CASCADE;
CREATE TABLE "rnoti" (
  "id" SERIAL PRIMARY KEY,
  "rid" INTEGER NOT NULL,
  "msg" text  NOT NULL,
  "date" TIMESTAMP NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "setting"
--

DROP TABLE IF EXISTS "setting" CASCADE;
CREATE TABLE "setting" (
  "id" SERIAL PRIMARY KEY,
  "one_key" text NOT NULL,
  "one_hash" text NOT NULL,
  "r_key" text NOT NULL,
  "r_hash" text NOT NULL,
  "currency" text  NOT NULL,
  "privacy_policy" TEXT NOT NULL,
  "about_us" TEXT NOT NULL,
  "contact_us" TEXT NOT NULL,
  "o_min" INTEGER NOT NULL,
  "timezone" text NOT NULL,
  "tax" INTEGER NOT NULL,
  "logo" text NOT NULL,
  "favicon" text NOT NULL,
  "title" text NOT NULL,
  "terms" text NOT NULL,
  "maintaince" INTEGER NOT NULL,
  "signupcredit" INTEGER NOT NULL,
  "refercredit" INTEGER NOT NULL
) ;

--
-- Dumping data for table "setting"
--

INSERT INTO "setting" ("id", "one_key", "one_hash", "r_key", "r_hash", "currency", "privacy_policy", "about_us", "contact_us", "o_min", "timezone", "tax", "logo", "favicon", "title", "terms", "maintaince", "signupcredit", "refercredit") VALUES
(1, 'XXXX', 'XXXX', 'XXXX', 'XXXX', '₹', '<p>XXXXXXXXX</p>\r\n', '<p>XXXXXXXXX</p>\r\n', '<p>XXXXXXXXX</p>\r\n', 100, 'Asia/Kolkata', 5, 'website/thump_1597913295.png', 'website/thump_1597913294.png', 'azumaa v1.5.2', '<p>XXXXXXXXX</p>\r\n', 0, 5, 5);

-- --------------------------------------------------------

--
-- Table structure for table "subcategory"
--

DROP TABLE IF EXISTS "subcategory" CASCADE;
CREATE TABLE "subcategory" (
  "id" SERIAL PRIMARY KEY,
  "cat_id" INTEGER NOT NULL,
  "name" text NOT NULL,
  "img" text NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "tbl_coupon"
--

DROP TABLE IF EXISTS "tbl_coupon" CASCADE;
CREATE TABLE "tbl_coupon" (
  "id" SERIAL PRIMARY KEY,
  "c_img" text  NOT NULL,
  "cdate" date NOT NULL,
  "c_desc" text  NOT NULL,
  "c_value" text  NOT NULL,
  "c_title" text  NOT NULL,
  "status" INTEGER NOT NULL DEFAULT '1',
  "ctitle" text  NOT NULL,
  "min_amt" INTEGER NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "template"
--

DROP TABLE IF EXISTS "template" CASCADE;
CREATE TABLE "template" (
  "id" SERIAL PRIMARY KEY,
  "title" text  NOT NULL,
  "message" text  NOT NULL,
  "url" text  NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "timeslot"
--

DROP TABLE IF EXISTS "timeslot" CASCADE;
CREATE TABLE "timeslot" (
  "id" SERIAL PRIMARY KEY,
  "mintime" text NOT NULL,
  "maxtime" text NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "uread"
--

DROP TABLE IF EXISTS "uread" CASCADE;
CREATE TABLE "uread" (
  "id" SERIAL PRIMARY KEY,
  "uid" INTEGER NOT NULL,
  "nid" INTEGER NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "user"
--

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "imei" text NOT NULL,
  "email" text NOT NULL,
  "ccode" text NOT NULL,
  "mobile" text NOT NULL,
  "rdate" TIMESTAMP NOT NULL,
  "password" text NOT NULL,
  "status" INTEGER NOT NULL DEFAULT '1',
  "pin" text,
  "wallet" DOUBLE PRECISION NOT NULL DEFAULT '0',
  "code" INTEGER NOT NULL,
  "refercode" INTEGER DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table "wallet_report"
--

DROP TABLE IF EXISTS "wallet_report" CASCADE;
CREATE TABLE "wallet_report" (
  "id" SERIAL PRIMARY KEY,
  "uid" INTEGER NOT NULL,
  "message" text NOT NULL,
  "status" text NOT NULL,
  "amt" INTEGER NOT NULL
) ;


DROP TABLE IF EXISTS "tbl_sale_item" CASCADE;
CREATE TABLE "tbl_sale_item" (
  "id" SERIAL PRIMARY KEY,
  "saleid" INTEGER NOT NULL,
  "pid" text NOT NULL
) ;

--
--





--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--


--
--

--
--


  

  

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--

--
--


