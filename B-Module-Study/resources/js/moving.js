$(document).ready(function(){
    // 사이드 메뉴 클릭
    $('.btnMenu').on('click', function(){
        $(this).fadeOut()
        $('section').addClass('on')
        $('nav').addClass('on')
    })

    // 사이드 메뉴의 각 메뉴 클릭 
    $('nav li').on('click', function(){
        $('.btnMenu').fadeIn()
        $('section').removeClass('on')
        $('nav').removeClass('on')

        // 페이지 회전 변화
        let i = $(this).index()
        $('section > div').removeClass('on')
        $('section > div').eq(i).addClass('on') // eq() : 0부터 시작하는 nth-child() 기능
    })
})