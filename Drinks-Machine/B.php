<?php 
    $money = $_GET['money'];

    echo "<h2>투입 금액 : $money</h2>";
?>

<form action="C.php" method="post">

<?php 
    // else를 사용하면 안되고, if문으로 쪼개야 한다.
    if($money >= 300) {
        echo "3 -- 웰치스 / 300원 <br>";
    }
    if($money >= 700) {
        echo "4 -- 환타 / 700원 <br>";
    }
    if($money >= 900) {
        echo "2 -- 칠성사이다 / 900원 <br>";
    }
    if($money >= 1200) {
        echo "1 -- 코카콜라 / 1200원 <br>";
    }
    if($money >= 1500) {
        echo "5 -- 암바사 / 1500원 <br>";
    }
?>

    <input type="text" name="money" value="<?=$money?>" hidden>
    <input type="text" name="idx" placeholder="구매 할 음료수 번호">
    <button type="submit">구매</button> <br>
</form>