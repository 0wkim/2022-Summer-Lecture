<?php 
    // echo "1 -- 코카콜라 / 1200원 <br>";
    // echo "2 -- 칠성사이다 / 900원 <br>";
    // echo "3 -- 웰치스 / 300원 <br>";
    // echo "4 -- 환타 / 700원 <br>";
    // echo "5 -- 암바사 / 1500원 <br>";

    $idx = $_POST['idx'];
    $money = $_POST['money'];

    switch($idx) {
        case 1 : echo "코카콜라"; break;
        case 2 : echo "칠성사이다"; break;
        case 3 : echo "웰치스"; break;
        case 4 : echo "환타"; break;
        case 5 : echo "암바사"; break;
    }

    echo " 음료수 나왔습니다. <br> 거스름돈은 ";

    switch($idx) {
        case 1 : {
            $rst = $money - 1200;
            echo "$rst";
            break;
        }
        case 2 : {
            $rst = $money - 900;
            echo "$rst";
            break;
        }
        case 3 : {
            $rst = $money - 300;
            echo "$rst";
            break;
        }
        case 4 : {
            $rst = $money - 700;
            echo "$rst";
            break;
        }
        case 5 : {
            $rst = $money - 1500;
            echo "$rst";
            break;
        }
    }

    echo "원 입니다.";

