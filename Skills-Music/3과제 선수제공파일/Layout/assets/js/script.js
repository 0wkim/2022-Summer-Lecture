// 필요한 변수 선언
let datas = new Array()
let category = new Set() // 중복제거
let render_data = new Array()
let cart = new Array()

let category_list = $('#main-menu li').eq(2)
let title = ["ALL"]
let main_list = $('.product-grid').eq(0)
let table_list = $('tbody tr').eq(0)

// 0. String Prototype (특수문자를 일반문자로 처리)
String.prototype.htmlEncode = function(){
    return this.replace(/./g, (x) => {
        return `&#${x.charCodeAt()}`
    })
}

// 3. Indexed DB (브라우저 재접속 시 유지)
let req = null;
let db = window.indexedDB.open('skills') // 'skills' 라는 DB 생성 및 열기

// 1. Indexed DB 작업
db.onupgradeneeded = e => {
    // 'req'에 명령을 내릴 수 있는 상태 저장
    req = e.target.result

    // 테이블 생성
    // 'datas' 테이블에 자동 증가되는 'idx' 키 값 생성
    req.createObjectStore('datas', {keyPath: 'idx', autoIncrement:true}) 

    // json 데이터 불러오기
    $.getJSON('/music_data.json', function(result){ // 불러온 데이터가 result에 저장
        // 내림차순 정렬 (발매일 기준)
        // a와 b를 비교하여 a가 클 경우 왼쪽위치(-1)에 붙게 되는 것
        datas = result.data.sort((a,b) => a.release > b.release ? -1 : 1)

        // Indexed DB에 데이터 저장
        // 'datas'에 readwrite'를 통해 저장하는 명령 적용
        let obj = req.transaction('datas', 'readwrite').objectStore('datas')
        // 'datas'의 각각의 내용 data를 obj에 삽입
        datas.forEach(data => {
            obj.put(data)
        })
        getDatas() // getDatas 함수 실행
    })
}

// 4. DB가 확인되면 실행 (웹 새로고침)
db.onsuccess = e => { // DB가 제대로 존재할 경우 실행
    req = e.target.result 
    getDatas()
}

// 2. Indexed DB 데이터 가져오기 & 카테고리 변수 추가
function getDatas(){
    let obj = req.transaction('datas', 'readwrite').objectStore('datas')
    let result = obj.getAll() // 'datas' 테이블의 모든 데이터를 result에 가져오기

    // 데이터를 제대로 가져왔을 경우
    result.onsuccess = e => {
        datas = e.target.result // datas 변수에 저장
        if (datas.length < 1) return // 정상적이지 않을 경우 (없을 경우) return

        // 데이터 중 카테고리를 추출해서 임의의 카테고리 변수에 추가
        datas.forEach(x => category.add(x.category)) // 'datas'의 각각의 값을 category에 추가
        // console.log(category) : Set(9) {'R&B', '발라드', '팝', '포크어코스틱', '랩힙합', …}

        init() //init 함수 실행
    }
}

// 6. Start 
function init() {
    // 카테고리 별로 음원을 구분하는 메뉴 제작
    categoryList()

    // 12. 로컬스토리지 불러와서 저장
    if (localStorage.title != undefined) {
        title = JSON.parse(localStorage.title)

        // 기존 액티브 제거
        $('.active-menu').removeClass('active-menu')

        // 신규 액티브 설정
        // $(this).find('a').addClass('active-menu')
    }

    if (localStorage.cart != undefined) {
        cart = JSON.parse(localStorage.cart)
        console.log(cart)
    }

    calc() // calc 함수
    setData()
    mainList()
} 

// 5. 왼쪽 사이드 메뉴 카테고리 리스트
function categoryList() {
    // 기본 제공 카테고리(발라드) clear(삭제) 
    $('#main-menu li').eq(2).remove()

    // 카테고리 메뉴 복사 후 내용 바꾸기
    category.forEach (x => {
        let clone = category_list.clone() // clone으로 복사
        clone.find('span').text(x) // span 태그를 찾아 텍스트 바꾸기
        $('#main-menu').append(clone)
    })
}

// 7. 사이드 메뉴 이벤트
$(document).on('click', '#main-menu li:not(:first-child)', function(e) { // 첫번째 li 빼고 모두 적용
    // 기본 이벤트, 버블링 이벤트 방지
    e.preventDefault()
    e.stopPropagation()

    // 기존 액티브 제거
    $('.active-menu').removeClass('active-menu')

    // 타이틀 변경
    title = [$(this).find('span').text()]

    // 12. 타이틀 로컬스토리지 저장
    localStorage.title = JSON.stringify(title)

    // 새로 눌린 메뉴에 대한 신규 액티브 설정
    $(this).find('a').addClass('active-menu')

    
    setData() // setData 함수 호출
    mainList() // mainList 함수 호출
}) 

// 8. 데이터 가공 (클릭한 카테고리의 데이터, 내림차순)
function setData() {
    // 렌더링용 데이터
    render_data = new Array() // 클릭할 때 마다 새로 필터링 되도록 다시 초기화

    title.forEach(data => {
        // 타겟 데이터
        let finds = new Array()

        // 기본적으로 설정 된 ALL 
        if(data == "ALL") {
            finds = datas 
        } else {
            // 사용자가 ALL이 아닌 다른 왼쪽 카테고리를 선택할 경우
            finds = datas.filter(x => x.category == data) 
        }

        // 선택된 왼쪽 카테고리의 대상들을 렌더링 할 'render_data에 push (정렬이 되지 않은 상태)
        finds.forEach(x => render_data.push(x))
    })

    // 음원 발매일 정렬 (내림차순)
    render_data.sort((a,b) => a.release > b.release ? -1 : 1)
}

// 9. 메인 리스트 출력 (render_data 리스트 업)
function mainList() {
    $('.product-grid').remove()

    // 선택된 카테고리 title 텍스트 변경
    $('h2').text(title)

    // 리스트 업 (내용 채우기)
    render_data.forEach(data => {
        let clone = main_list.clone()

        // clone의 내용 수정(삽입)
        clone.find('img').attr('src', 'images/' + data.albumJaketImage) // json의 albumJaketImage
        clone.find('h5').html(data.albumName.htmlEncode()) // json의 albumName
        clone.find('p').eq(0).html(data.artist.htmlEncode()) // json의 artist
        clone.find('p').eq(1).text(data.release) // json의 release
        clone.find('p').eq(2).text('₩' + parseInt(data.price).toLocaleString()) // json의 price, toLocalString : 세자리수에 자동 콤마(,)
        clone.find('button').attr('data-idx', data.idx)

        // 12. 카트에 담긴 갯수 연동
        let find = cart.find(x => x.idx == data.idx)
        if (find) {
            clone.find('button').html(`<i class="fa fa-shopping-cart"></i> 추가하기 (${find.count}개)`)
        }

        // 내용 추가 
        $('.contents').append(clone)
    })
}

// 10. 카트 담기, 추가하기 버튼 클릭시 상단 카트정보에 수량과 가격이 합산
// & 카트 담기 버튼은 추가하기 버튼으로 변경
$(document).on('click', '.product-grid button', function(){
    let idx = $(this).data('idx') // 내가 클릭한 data의 'idx'값 불러오기
    let data = {idx: idx, count: 1}
    let findIdx = cart.findIndex(x => x.idx == idx) 

    if (findIdx != -1) {
        // 상품이 이미 존재할 경우
        cart[findIdx].count++
        data.count = cart[findIdx].count
    } else {
        cart.push(data)
    }

    calc() // calc 함수 호출
    $(this).html(`<i class="fa fa-shopping-cart"></i> 추가하기 (${data.count}개)`)
})

// 11. 상단 카트 가격, 수량 계산
function calc() {
    // 초기에는 모두 0
    let price = 0
    let count = 0

    cart.forEach(data => {
        let find = datas.find(x => x.idx == data.idx)
        price += data.count * parseInt(find.price) // 가격 증가
        count += data.count // 개수 증가
    })

     // 12. 카트 내용 저장
    localStorage.cart = JSON.stringify(cart)

    $('.panel-body > .btn-primary').eq(0).html(`<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${count}</strong> 개 금액 ￦ ${price.toLocaleString()}원`)

    // 14. 카트 금액 총 합계 실시간 반영
    let priceSum = 0

    cart.forEach(data => {
        let find = datas.find(x => x.idx == data.idx)
        priceSum += parseInt(find.price) * data.count 
    })

    $('h3').html(`총 합계금액 : <span>￦` + priceSum.toLocaleString() + `</span> 원`)
}


// 13. 쇼핑카트 (상단 카트정보를 클릭하면 모달창이 열리고 카트에 담긴 목록을 보여줌)
$('.panel-body > .btn-primary').eq(0).on('click', cartList)

function cartList() {
    $('#myModal tbody tr').remove()

    cart.forEach(data => {
        let find = datas.find(x => x.idx == data.idx)

        let clone = table_list.clone()
        clone.find('img').attr('src', 'images/' + find.albumJaketImage)
        clone.find('h4').html(find.albumName.htmlEncode())
        clone.find('p').eq(0).html(find.artist.htmlEncode())
        clone.find('p').eq(1).html(find.release)
        clone.find('.albumprice').text('￦' + parseInt(find.price).toLocaleString())
        clone.find('input').attr('data-idx', data.idx).val(data.count)
        clone.find('.pricesum').text('￦' + (parseInt(find.price) * data.count).toLocaleString() )
        clone.find('button').attr('data-idx', data.idx)

        $('#myModal tbody').append(clone)
    })
}

// 15. 쇼핑카트 수량을 1 이상 입력할 수 있고, 변경시 합계, 총합계 자동 계산
$(document).on('input', '#myModal tr input', function () {
    let idx = $(this).data('idx')
    let val = parseInt($(this).val())
    let findIdx = cart.findIndex(x => x.idx == idx)
    let find = datas.find(x => x.idx == idx)

    // 1 미만 입력 방지
    if (val < 1 || isNaN(val)) {
        val = cart[findIdx].count
    }
    cart[findIdx].count = val

    // 카트 정보 동기화
    calc()

    $(this).val(val)
    $(this).parent().parent().find('.pricesum').text('￦' + (parseInt(find.price) * val).toLocaleString())

    
})

// 16. 쇼핑카트의 삭제 버튼
$(document).on('click', '#myModal tr button', function(){
    if(!confirm('정말 삭제하시겠습니까?')) return // 삭제 확인

    // 삭제 기능
    let idx = $(this).data('idx')
    let findIdx = cart.findIndex(x => x.idx == idx) // cart의 인덱스 값
    
    cart.splice(findIdx, 1)
    $(this).parent().parent().remove() // tr 부분을 날리는 것

    calc()
})

// 17. 쇼핑카트의 결제 버튼 (결제 버튼 클릭시 결제 완료, 카트 목록이 제거되고 창 닫힘)
$('#myModal .modal-footer .btn-primary').on('click', function(){
    alert('결제가 완료되었습니다')

    // 결제 완료 후 카트내용 지우기
    cart = []
    localStorage.cart = "[]"
    // buy.push({datas : cart}) => 구매목록으로 넘어가는 것

    // 카트 목록 새로고침(비우기)
    cartList()
    calc()

    // 모달 창 닫힘
    // '결제하기' 옆의 '닫기' 버튼이 눌리는 효과
    $('#myModal .modal-footer .btn-default').click()
})
