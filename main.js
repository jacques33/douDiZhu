var allCards = [
    "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A18", //黑桃
    "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "B14", "B18", //红桃
    "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "C14", "C18", //梅花
    "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14", "D18", //方块
    "W20", "W21"                                                                        //大小王
];
var user1 = {
    name: "电脑[1]",
    cards: [],
    index: 1
};
var user2 = {
    name: "Jacques",
    cards: [],
    index: 2
};
var user3 = {
    name: "电脑[2]",
    cards: [],
    index: 3
};
var dizhu; // 地主
var current_card; // 当前牌桌上出的牌,默认初始值0
var current_card_user;// 当前牌桌上出的牌的出牌人
var user_choosed_card; //当前出牌人选中的牌
var current_user;  // 当前出牌人
var isShow = false; // 电脑是否明牌显示

// 选择明牌/暗牌，开始游戏
function choosePlayType(obj,e) {
    var type = $(obj).attr('type');
    init(type);
    $(obj).parents('.choosePlayType').fadeOut();
}
// 再来一局
function oneMoreGame(obj,e) {
    $(obj).parents('.modal ').hide();
    $('.choosePlayType').fadeIn();
}
// 初始化数据
function init(type) {
    type == '1'?isShow=true:isShow=false;
    current_user = {};
    user_choosed_card = [];
    current_card = [];
    current_card_user = {};
    dizhu = {
        name: "",
        cards: []
    };
    $('#current-cards-area').html('');
    $('#cards-area').html('');
    $('.content').html('').css('height', '100px').hide;
    $('.modal').hide();
    $('.current-card-username').html('').parent().hide();
    divideCards();
}

//将牌随机打乱，然后分成三份
function divideCards() {
    // 洗牌算法
    for(var len=allCards.length-1,i=len;i>0;i--){
        let tempKey = Math.floor(Math.random()*(i+1));
        if(tempKey === i) continue;

        let temp = allCards[i];
        allCards[i] = allCards[tempKey]
        allCards[tempKey] = temp;
    }
    // 分派
    user1.cards = allCards.slice(0, 17);
    user2.cards = allCards.slice(17, 34);
    user3.cards = allCards.slice(34, 51);
    dizhu.cards = allCards.slice(51);
    whoIsDizhu();
};

// 随机分配地主，并渲染相应角色头像
function whoIsDizhu() {
    var random = Math.random() * 3;
    if (random >= 1 && random < 2) {
        user2.cards = user2.cards.concat(dizhu.cards);
        dizhu.name = user2.name;
        current_user = user2;
        user1.role = '农民';
        user2.role = '地主';
        user3.role = '农民';
        $('.left-role').html('<img src="./img/famer.jpg"><strong>农民</strong> 电脑[1]');
        $('.right-role').html('<img src="./img/famer.jpg"><strong>农民</strong> 电脑[2]');
        $('.current-user').html('<img src="img/landlord.jpg"><span class="current-user-role">地主</span>');
        changeBellPos(2);
    } else if (random >= 2) {
        user3.cards = user3.cards.concat(dizhu.cards);
        dizhu.name = user3.name;
        current_user = user3;
        user1.role = '农民';
        user3.role = '地主';
        user2.role = '农民';
        $('.left-role').html('<img src="./img/famer.jpg"><strong>农民</strong> 电脑[1]');
        $('.right-role').html('<img src="./img/landlord.jpg"><strong>地主</strong> 电脑[2]');
        $('.current-user').html('<img src="img/famer.jpg"><span class="current-user-role">农民</span>');
        changeBellPos(3);
        disabledButtons();
        computerAutoPlay(3)
    } else {
        user1.cards = user1.cards.concat(dizhu.cards);
        dizhu.name = user1.name;
        current_user = user1;
        user2.role = '农民';
        user1.role = '地主';
        user3.role = '农民';
        $('.left-role').html('<img src="./img/landlord.jpg"><strong>地主</strong> 电脑[1]');
        $('.right-role').html('<img src="./img/famer.jpg"><strong>农民</strong> 电脑[2]');
        $('.current-user').html('<img src="img/famer.jpg"><span class="current-user-role">农民</span>');
        changeBellPos(1);
        disabledButtons();
        computerAutoPlay(1)
    }
    current_user.role = '地主';
    current_card_user = current_user;
    drawAllCards();
}

// 绘制三家的牌
function drawAllCards() {
    var cards1 = sortUserCards(user1.cards);
    var cards2 = sortUserCards(user2.cards);
    var cards3 = sortUserCards(user3.cards);
    drawUserCards(cards2);
    drawComputorCards(1, cards1);
    drawComputorCards(3, cards3);
}

// 牌进行排序的方法
function sortUserCards(cards) {
    var user_cards = cards;
    user_cards.sort(function (a, b) {
        var aIndex = a.substring(1);
        var bIndex = b.substring(1);
        if (parseInt(aIndex) > parseInt(bIndex)) {
            return 1
        } else {
            return -1
        }
    });
    return user_cards
}

// 绘制牌面
// type: 1,玩家的牌；2，桌面的牌
function drawCards(cards, type) {
    var allDom = '';
    for (var i in cards) {
        var color = cards[i].substring(0, 1);
        var num = cards[i].substring(1);
        var displayNum = num;
        var displayImg = color + '.jpg';
        var displayColorClass = 'color-' + color;
        var dispalyStyleClass = '';
        var space = i * 45 + 'px';
        if (parseInt(displayNum) >= 10) {
            switch (displayNum) {
                case "10":
                    // 10占了两个字符，因此要调整以统一显示样式
                    dispalyStyleClass = 'num-10';
                    break;
                case "11":
                    displayNum = "J";
                    break;
                case "12":
                    displayNum = "Q";
                    break;
                case "13":
                    displayNum = "K";
                    break;
                case "14":
                    displayNum = "A";
                    break;
                case "18":
                    displayNum = "2";
                    break;
                case "20":
                    displayNum = "W";
                    displayImg = "W1.png";
                    displayColorClass = "color-A";
                    break;
                case "21":
                    displayNum = "W";
                    displayImg = "W2.png";
                    displayColorClass = "color-B";
                    break;
            }
        }
        var dom = '<div class="card" card="' + cards[i] + '" style="margin-left:' + space + ' " onclick="choosePreCard(this)">\n' +
            '        <span class="card-num ' + displayColorClass + ' ' + dispalyStyleClass + '">' + displayNum + '</span>\n' +
            '        <span class="card-num ' + displayColorClass + ' ' + dispalyStyleClass + '-B bl">' + displayNum + '</span>\n' +
            '        <img class="card-color" src="img/' + displayImg + '">\n' +
            '        <img class="card-color-min" src="img/' + displayImg + '">\n' +
            '        <img class="card-color-min-bl" src="img/' + displayImg + '">\n' +
            '    </div>';
        if (type == 2) {
            dom = dom.replace('choosePreCard(this)', '');
        }
        allDom += dom;
    }
    return allDom
}

// 绘制电脑的牌
function drawComputorCards(index, cards) {
    var allDom = '';
    for (var i in cards) {
        var color = cards[i].substring(0, 1);
        var num = cards[i].substring(1);
        var displayNum = num;
        var displayImg = color + '.jpg';
        var displayColorClass = 'color-' + color;
        var dispalyStyleClass = '';
        var space = i * 30 + 'px';
        if (parseInt(displayNum) >= 10) {
            switch (displayNum) {
                case "10":
                    // 10占了两个字符，因此要调整以统一显示样式
                    dispalyStyleClass = 'num-10';
                    break;
                case "11":
                    displayNum = "J";
                    break;
                case "12":
                    displayNum = "Q";
                    break;
                case "13":
                    displayNum = "K";
                    break;
                case "14":
                    displayNum = "A";
                    break;
                case "18":
                    displayNum = "2";
                    break;
                case "20":
                    displayNum = "W";
                    displayImg = "W1.png";
                    displayColorClass = "color-A";
                    break;
                case "21":
                    displayNum = "W";
                    displayImg = "W2.png";
                    displayColorClass = "color-B";
                    break;
            }
        }
        var dom;
        // 明牌/暗牌
        if(isShow){
            dom = '<div class="o-card" card="' + cards[i] + '" style="margin-top:' + space + ' ">\n' +
                '        <span class="card-num ' + displayColorClass + ' ' + dispalyStyleClass + '">' + displayNum + '</span>\n' +
                '        <span class="card-num ' + displayColorClass + ' ' + dispalyStyleClass + '-B bl">' + displayNum + '</span>\n' +
                '        <img class="card-color" src="img/' + displayImg + '">\n' +
                '        <img class="card-color-min" src="img/' + displayImg + '">\n' +
                '        <img class="card-color-min-bl" src="img/' + displayImg + '">\n' +
                '    </div>';
        }else{
            dom = '<div class="o-card back-card" card="' + cards[i] + '" style="margin-top:' + space + ' ">\n' +
                '    </div>';
        }
        allDom += dom;
    }
    // var cn = cards.length;
    // var windowHeight = $(window).height();
    // var height = (cn - 1) * 20 + 150;
    // var ml = (windowHeight - height) / 2 -120 + 'px';// 50是为了视觉上电脑玩家的牌偏上一些，完全居中不好看
    // 左边的电脑玩家
    if (index == 1) {
        $('.left-user').html(allDom).find('.o-card')
    } else {
        $('.right-user').html(allDom).find('.o-card')
    }
}

// 将用户的牌展示到指定区域
function drawUserCards(cards) {
    var dom = drawCards(cards, 1);
    var cn = cards.length;
    var windowWidth = $(window).width();
    var width = (cn - 1) * 45 + 202;
    var ml = (windowWidth - width) / 2 + 'px';
    $('#cards-area').html(dom).find('.card').css('left', ml);
}

// 将当前出的牌展示到中央区域
function drawCurrentCards(cards) {
    cards.sort(function (a, b) {
        return parseInt(a.substring(1)) >= parseInt(b.substring(1)) ? 1 : -1
    });
    var dom = drawCards(cards, 2);
    var cn = cards.length;
    var windowWidth = $(window).width();
    var width = (cn - 1) * 45 + 152;
    var ml = (windowWidth - width) / 2 + 'px';
    $('#current-cards-area').html(dom).find('.card').css('left', ml);
}

// 出牌规则检测
function checkChoosedCards(cards) {
    // 如果牌桌上的牌是自己出的，则清空current_card（也就是不考虑大小规则）；
    if (current_card_user.name == current_user.name) {
        current_card = [];
    }
    var flag = true;
    var cl = cards.length;
    if (cl == 1) {
        var num = cards[0].substring(1);

        // 如果是第一个出牌人，则直接返回OK
        if (current_card.length == 0) {
            flag = true

            // 如果当前牌面不止一张牌，false
        } else if (current_card.length != 1) {
            flag = false
        }
        // 如果选择的牌不大于桌面的牌
        else if (parseInt(num) <= parseInt(current_card[0])) {
            flag = false
        } else {
            flag = true;
        }
    } else if (cl == 2) {
        var c1 = parseInt(cards[0].substring(1));
        var c2 = parseInt(cards[1].substring(1));
        // 不相等且不是两张王
        if (c1 != c2 && c1 < 20) {
            flag = false

            // 两张王，最大，任何情况都可以
        } else if (c1 >= 20 && c2 >= 20) {
            flag = true
        } else if (c1 == c2) {
            // 如果是第一个出牌人，则直接返回OK
            if (current_card.length == 0) {
                flag = true
            }
            // 如果当前牌面不是2张牌，false
            else if (current_card.length != 2) {
                flag = false
            }
            // 如果选择的牌不大于桌面的牌
            else if (c1 <= parseInt(current_card[0])) {
                flag = false
            } else {
                flag = true;
            }
        }
    } else if (cl == 3) {
        var c1 = parseInt(cards[0].substring(1));
        var c2 = parseInt(cards[1].substring(1));
        var c3 = parseInt(cards[2].substring(1));
        // 三张牌是不同的
        if (c1 != c2 || c1 != c3 || c2 != c3) {
            flag = false
        }
        // 三张牌为同一数字（e: 666）
        if (c1 == c2 && c2 == c3) {
            // 如果是第一个出牌人，则直接返回OK
            if (current_card.length == 0) {
                flag = true
            }
            // 如果当前牌面不是三张牌，false
            else if (current_card.length != 3) {
                flag = false
            }
            // 如果选择的牌不大于桌面的牌
            else if (c1 <= parseInt(current_card[0])) {
                flag = false
            } else {
                flag = true;
            }
        }
    } else if (cl == 4) {
        var c1 = parseInt(cards[0].substring(1));
        var c2 = parseInt(cards[1].substring(1));
        // 如果是炸弹
        if (isBomb(cards)) {
            // 如果是第一个出牌人，则直接返回OK
            if (current_card.length == 0) {
                flag = true;
            }
            // 如果当前牌面也是炸弹，则比较大小
            else if (isBomb(current_card)) {
                if (c1 > parseInt(current_card[0].substring(1))) {
                    flag = true;
                } else {
                    flag = false;
                }
            } else {
                flag = true;
            }
            // 如果是三带一
        } else if (isThreePlusOne(cards)) {
            // 如果是第一个出牌人，则直接返回OK
            if (current_card.length == 0) {
                flag = true;
            } else if (isThreePlusOne(current_card)) {
                if (isThreePlusOne(cards) > isThreePlusOne(current_card)) {
                    flag = true;
                } else {
                    flag = false;
                }
            } else {
                flag = false;
            }
        } else {
            flag = false;
        }
    } else if (cl > 4) {
        // 顺子
        var a = isContinuousCards(cards);
        var b = isContinuousCards(current_card);
        // 飞机
        var c = isPlaneWithCards(cards);
        var d = isPlaneWithCards(current_card);
        // 四带二
        var e = isBombWithCards(cards);
        var f = isBombWithCards(current_card);
        // 连对
        var g = isContinuousPairCards(cards);
        var h = isContinuousPairCards(current_card);
        // 三带二
        var i = isThreePlusTwo(cards);
        var j = isThreePlusTwo(current_card);

        var arr1 = [a, b, c, d, e, f, g, h, i, j];
        var my_type = false;
        var curr_type = false;
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i]) {
                my_type = arr1[i];
                curr_type = arr1[i + 1];
                break;
            }
        }
        if (my_type) {
            // 如果是第一个出牌人，则直接返回OK
            if (current_card.length == 0) {
                flag = true;
            } else if (curr_type && current_card.length == cards.length) {
                if (my_type > curr_type) {
                    flag = true;
                } else {
                    flag = false
                }
            } else {
                flag = false;
            }
        } else {
            flag = false
        }
    }
    return flag
}


/** 牌面点击预选择事件 */
function choosePreCard(obj) {
    if(current_user.index != 2){
        return
    }
    var card = $(obj).attr('card');
    if ($(obj).hasClass('pre-card')) {
        $(obj).removeClass('pre-card');
        var index = user_choosed_card.indexOf(card);
        user_choosed_card.splice(index, 1);
    } else {
        $(obj).addClass('pre-card');
        user_choosed_card.push(card);
    }
}

/** 重新选牌事件 */
function reChooseCards() {
    $('.card').removeClass('pre-card');
    user_choosed_card = [];
}

/** 不要牌 */
function pass() {
    // 如果牌桌上的牌是自己出的或者是第一个人，则清空current_card（也就是不考虑大小规则）；
    if (current_card_user.name == current_user.name || current_card == []) {
        showTip('请您出牌');
        return
    }
    reChooseCards();
    changeCurrentUser();
}

/** 确认出牌 */
function submitCards() {
    if (user_choosed_card.length == 0) {
        showTip('您还没有选牌');
    } else if (checkChoosedCards(user_choosed_card)) {
        // 把当前用户的牌中去掉要出的牌
        for (var i in user_choosed_card) {
            var index = $.inArray(user_choosed_card[i], current_user.cards);
            if (index > -1) {
                current_user.cards.splice(index, 1);
            }
        }
        current_card = user_choosed_card;
        current_card_user = current_user;
        $('.current-card-username').html(current_card_user.name).parent().show();
        drawCurrentCards(user_choosed_card);
        drawUserCards(current_user.cards);
        changeCurrentUser();
    } else {
        showTip('选择牌型错误');
    }
}
// 真实玩家自动提示
function realPlayerAutoChooseCard() {
    autoChooseCard(2);
}

/** 自动提示出牌 */
function autoChooseCard(index) {
    var CardsAreaDom,curr_player_cards;
    if(index ==1){
        CardsAreaDom = $('.left-user').find('.o-card');
        curr_player_cards = user1.cards;
    }else if(index ==3){
        CardsAreaDom = $('.right-user').find('.o-card');
        curr_player_cards = user3.cards;
    }else{
        CardsAreaDom = $('#cards-area').find('.card');
        curr_player_cards = user2.cards;
    }

    var arr = [];
    for (var i = 0; i < curr_player_cards.length; i++) {
        var item = parseInt(curr_player_cards[i].substring(1));
        arr.push(item);
    }
    // 升序排序
    arr.sort(function (a, b) {
        return a - b
    });
    // 先将牌放入一个对象中，例如 牌是 三个6三个7 带一8 带一9  66677798，
    // 那么这个对象就是{6:3, 7:3, 9:1, 8:1}, key为牌，value为相同牌的张数
    var divideCards = {};
    var arrNoRepeat = [];//arr的去重数组（用于计算顺子）
    for (var j = 0; j < arr.length; j++) {
        if (divideCards[arr[j]]) {
            divideCards[arr[j]]++;
        } else {
            divideCards[arr[j]] = 1;
        }
        // 如果数组中没有，就加入数组中
        if ($.inArray(arr[j], arrNoRepeat) < 0) {
            arrNoRepeat.push(arr[j]);
        }
    }

    // 如果当前桌面牌是自己的，或者是第一个出牌人，则选择最小的牌
    if (current_card.length == 0 || current_user.name == current_card_user.name) {
        var minus = curr_player_cards[0].substring(1);
        for (var i = 0; i < curr_player_cards.length; i++) {
            if (minus == curr_player_cards[i].substring(1)) {
                CardsAreaDom.eq(i).addClass('pre-card');
                user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
            }
        }
        // 如果最小的牌是三张,则自动带上一张单牌
        if(user_choosed_card.length == 3){
            var single = findMinKeyInObject(1,0,divideCards);
            for (var i = 0; i < curr_player_cards.length; i++) {
                if (single == curr_player_cards[i].substring(1)) {
                    CardsAreaDom.eq(i).addClass('pre-card');
                    user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                    break;
                }
            }
        }
        //如果最小的牌是炸弹，则不出
        if(user_choosed_card.length == 4){
            user_choosed_card = [];
            CardsAreaDom.removeClass('pre-card');
            var single = findMinKeyInObject(1,0,divideCards);
            for (var i = 0; i < curr_player_cards.length; i++) {
                if (single == curr_player_cards[i].substring(1)) {
                    CardsAreaDom.eq(i).addClass('pre-card');
                    user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                    break;
                }
            }
        }

    } else {
        //先判断用户牌的数量是否足够
        if (curr_player_cards.length < current_card.length) {
            bombBang(0,divideCards,CardsAreaDom);
            return
        }
        var type = checkType(current_card).type;
        var value = checkType(current_card).value;
        switch (type) {
            case 1:
                // 找到大于桌面牌的最小的单牌
                var key = findMinKeyInObject(1, value, divideCards);
                if (key) {
                    for (var i = 0; i < curr_player_cards.length; i++) {
                        if (key == curr_player_cards[i].substring(1)) {
                            CardsAreaDom.eq(i).addClass('pre-card');
                            user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                            break;
                        }
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 2:
                // 找到大于桌面牌的最小的对牌
                var key = findMinKeyInObject(2, value, divideCards);
                if (key) {
                    var count = 0; // 只取两张（因为findMinKeyInObject找出的值可能是3个里面挑出的对子，所以要限制牌数）
                    for (var i = 0; i < curr_player_cards.length; i++) {
                        if (key == curr_player_cards[i].substring(1) && count < 2) {
                            CardsAreaDom.eq(i).addClass('pre-card');
                            user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                            count++;
                        }
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 3:
                // 找到大于桌面牌的最小的顺子
                var cur_len = current_card.length;
                var repeatArr = [];//连续等差数
                for (var i = 0; i + 1 < arrNoRepeat.length; i++) {
                    if (repeatArr.length == cur_len) {
                        break;
                    } else {
                        if (arrNoRepeat[i] > value && arrNoRepeat[i] + 1 == arrNoRepeat[i + 1]) {
                            // 如果数组中没有，就加入数组中
                            if ($.inArray(arrNoRepeat[i], repeatArr) < 0) {
                                repeatArr.push(arrNoRepeat[i]);
                            }
                            if ($.inArray(arrNoRepeat[i + 1], repeatArr) < 0) {
                                repeatArr.push(arrNoRepeat[i + 1]);
                            }
                        } else {
                            repeatArr = [];
                        }
                    }
                }
                // 如果有满足条件的顺子，就出顺子
                if (repeatArr.length == cur_len) {
                    for (var j = 0; j < repeatArr.length; j++) {
                        for (var i = 0; i < curr_player_cards.length; i++) {
                            if (repeatArr[j] == curr_player_cards[i].substring(1)) {
                                CardsAreaDom.eq(i).addClass('pre-card');
                                user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                break;
                            }
                        }
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 4:
                // 找到大于桌面牌的最小的连对
                var doubleCardArray = [];//所有的能组成对子的牌的集合(不拆炸弹)
                $.each(divideCards, function (key, val) {
                    if (val == 2 || val == 3) {
                        doubleCardArray.push(parseInt(key));
                    }
                });
                // 排序
                doubleCardArray.sort(function (a, b) {
                    return a > b ? 1 : -1
                });
                var cur_len = current_card.length / 2;
                var repeatArr = [];//连续等差数
                // 如果对子数量不满足条件，直接要不起
                if (doubleCardArray.length >= cur_len) {
                    for (var i = 0; i + 1 < doubleCardArray.length; i++) {
                        if (repeatArr.length == cur_len) {
                            break;
                        } else {
                            if (doubleCardArray[i] > value && doubleCardArray[i] + 1 == doubleCardArray[i + 1]) {
                                // 如果数组中没有，就加入数组中
                                if ($.inArray(doubleCardArray[i], repeatArr) < 0) {
                                    repeatArr.push(doubleCardArray[i]);
                                }
                                if ($.inArray(doubleCardArray[i + 1], repeatArr) < 0) {
                                    repeatArr.push(doubleCardArray[i + 1]);
                                }
                            } else {
                                repeatArr = [];
                            }
                        }
                    }
                    // 如果有满足条件的连对
                    if (repeatArr.length == cur_len) {
                        for (var j = 0; j < repeatArr.length; j++) {
                            var count = 0;//保证某张牌值只选两张
                            for (var i = 0; i < curr_player_cards.length; i++) {
                                if (count >= 2) {
                                    break;
                                }
                                if (repeatArr[j] == curr_player_cards[i].substring(1)) {
                                    CardsAreaDom.eq(i).addClass('pre-card');
                                    user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                    count++;
                                }
                            }
                        }
                    } else {
                        bombBang(0,divideCards,CardsAreaDom);
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 51:
                // 找到大于桌面牌的最小的飞机不带
                var tripleCardArray = [];//所有的能组成对子的牌的集合(不拆炸弹)
                $.each(divideCards, function (key, val) {
                    if (val == 3) {
                        tripleCardArray.push(parseInt(key));
                    }
                });
                // 排序
                tripleCardArray.sort(function (a, b) {
                    return a > b ? 1 : -1
                });
                var cur_len = current_card.length / 3;
                var repeatArr = [];//连续等差数
                // 如果对子数量不满足条件，直接要不起
                if (tripleCardArray.length >= cur_len) {
                    for (var i = 0; i + 1 < tripleCardArray.length; i++) {
                        if (repeatArr.length == cur_len) {
                            break;
                        } else {
                            if (tripleCardArray[i] > value && tripleCardArray[i] + 1 == tripleCardArray[i + 1]) {
                                repeatArr.push(tripleCardArray[i]);
                                repeatArr.push(tripleCardArray[i + 1]);
                                break;
                            } else {
                                repeatArr = [];
                            }
                        }
                    }
                    // 如果有满足条件的飞机
                    if (repeatArr.length == cur_len) {
                        for (var j = 0; j < repeatArr.length; j++) {
                            for (var i = 0; i < curr_player_cards.length; i++) {
                                if (repeatArr[j] == curr_player_cards[i].substring(1)) {
                                    CardsAreaDom.eq(i).addClass('pre-card');
                                    user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                }
                            }
                        }
                    } else {
                        bombBang(0,divideCards,CardsAreaDom);
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 52:
                // 找到大于桌面牌的最小的飞机带单牌
                var tripleCardArray = [];//所有的能组成对子的牌的集合(不拆炸弹)
                $.each(divideCards, function (key, val) {
                    if (val == 3) {
                        tripleCardArray.push(parseInt(key));
                    }
                });
                // 排序
                tripleCardArray.sort(function (a, b) {
                    return a > b ? 1 : -1
                });
                var cur_len = 2;
                var repeatArr = [];//连续等差数
                // 如果三张的数量不满足条件，直接要不起
                if (tripleCardArray.length >= cur_len) {
                    for (var i = 0; i + 1 < tripleCardArray.length; i++) {
                        if (repeatArr.length == cur_len) {
                            break;
                        } else {
                            if (tripleCardArray[i] > value && tripleCardArray[i] + 1 == tripleCardArray[i + 1]) {
                                repeatArr.push(tripleCardArray[i]);
                                repeatArr.push(tripleCardArray[i + 1]);
                                break;
                            } else {
                                repeatArr = [];
                            }
                        }
                    }
                    // 如果有满足条件的飞机
                    if (repeatArr.length == cur_len) {
                        var singles = bringCards(repeatArr, 1,2,divideCards);
                        if (singles) {
                            // 先出飞机
                            for (var j = 0; j < repeatArr.length; j++) {
                                for (var i = 0; i < curr_player_cards.length; i++) {
                                    if (repeatArr[j] == curr_player_cards[i].substring(1)) {
                                        CardsAreaDom.eq(i).addClass('pre-card');
                                        user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                    }
                                }
                            }
                            //再出单牌
                            for (var j = 0; j < singles.length; j++) {
                                for (var i = 0; i < curr_player_cards.length; i++) {
                                    if (singles[j] == curr_player_cards[i].substring(1)) {
                                        CardsAreaDom.eq(i).addClass('pre-card');
                                        user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                        break;
                                    }
                                }
                            }
                        } else {
                            showTip('不 要')
                        }


                    } else {
                        bombBang(0,divideCards,CardsAreaDom);
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 53:
                // 找到大于桌面牌的最小的飞机不带
                var tripleCardArray = [];//所有的能组成对子的牌的集合(不拆炸弹)
                $.each(divideCards, function (key, val) {
                    if (val == 3) {
                        tripleCardArray.push(parseInt(key));
                    }
                });
                // 排序
                tripleCardArray.sort(function (a, b) {
                    return a > b ? 1 : -1
                });
                var cur_len = current_card.length / 3;
                var repeatArr = [];//连续等差数
                // 如果三张的数量不满足条件，直接要不起
                if (tripleCardArray.length >= cur_len) {
                    for (var i = 0; i + 1 < tripleCardArray.length; i++) {
                        if (repeatArr.length == cur_len) {
                            break;
                        } else {
                            if (tripleCardArray[i] > value && tripleCardArray[i] + 1 == tripleCardArray[i + 1]) {
                                repeatArr.push(tripleCardArray[i]);
                                repeatArr.push(tripleCardArray[i + 1]);
                                break;
                            } else {
                                repeatArr = [];
                            }
                        }
                    }
                    // 如果有满足条件的飞机
                    if (repeatArr.length == cur_len) {
                        var singles = bringCards(repeatArr,2,2,divideCards);
                        if (singles) {
                            // 先出飞机
                            for (var j = 0; j < repeatArr.length; j++) {
                                for (var i = 0; i < curr_player_cards.length; i++) {
                                    if (repeatArr[j] == curr_player_cards[i].substring(1)) {
                                        CardsAreaDom.eq(i).addClass('pre-card');
                                        user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                    }
                                }
                            }
                            //再出单牌
                            for (var j = 0; j < singles.length; j++) {
                                for (var i = 0; i < curr_player_cards.length; i++) {
                                    if (singles[j] == curr_player_cards[i].substring(1)) {
                                        CardsAreaDom.eq(i).addClass('pre-card');
                                        user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                        break;
                                    }
                                }
                            }
                        } else {
                            showTip('不 要')
                        }


                    } else {
                        bombBang(0,divideCards,CardsAreaDom);
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 6:
                bombBang(value,divideCards,CardsAreaDom);
                break;
            case 71:
                var key = findMinKeyInObject(3, value, divideCards);
                if (key) {
                    var newCards = JSON.parse(JSON.stringify(divideCards));
                    delete newCards[key];
                    var singleCard = findMinKeyInObject(1, 0, newCards);
                    if (singleCard) {
                        for (var i = 0; i < curr_player_cards.length; i++) {
                            if (key == curr_player_cards[i].substring(1)) {
                                CardsAreaDom.eq(i).addClass('pre-card');
                                user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                            }
                        }
                        for (var i = 0; i < curr_player_cards.length; i++) {
                            if (singleCard == curr_player_cards[i].substring(1)) {
                                CardsAreaDom.eq(i).addClass('pre-card');
                                user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                break;
                            }
                        }
                    } else {
                        bombBang(0,divideCards,CardsAreaDom)
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 72:
                var key = findMinKeyInObject(3, value, divideCards);
                if (key) {
                    var newCards = JSON.parse(JSON.stringify(divideCards));
                    delete newCards[key];
                    var coupleCard = findMinKeyInObject(2, 0, newCards);
                    if (coupleCard) {
                        for (var i = 0; i < curr_player_cards.length; i++) {
                            if (key == curr_player_cards[i].substring(1)) {
                                CardsAreaDom.eq(i).addClass('pre-card');
                                user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                            }
                        }
                        for (var i = 0; i < curr_player_cards.length; i++) {
                            var count = 0;
                            if (coupleCard == curr_player_cards[i].substring(1) && count < 2) {
                                CardsAreaDom.eq(i).addClass('pre-card');
                                user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                                count++;
                            }
                        }
                    } else {
                        bombBang(0,divideCards,CardsAreaDom)
                    }
                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 73:
                var key = findMinKeyInObject(3, value, divideCards);
                if (key) {
                    for (var i = 0; i < curr_player_cards.length; i++) {
                        if (key == curr_player_cards[i].substring(1)) {
                            CardsAreaDom.eq(i).addClass('pre-card');
                            user_choosed_card.push(CardsAreaDom.eq(i).attr('card'));
                        }
                    }

                } else {
                    bombBang(0,divideCards,CardsAreaDom);
                }
                break;
            case 81:
                bombBang(value,divideCards,CardsAreaDom);
                break;
            case 82:
                bombBang(value,divideCards,CardsAreaDom);
                break;
            case 10:
                showTip('不 要');
        }
    }
}

/** 切换到下一个出牌人 */
function changeCurrentUser() {
    // 是否王炸
    if (isBigBang(user_choosed_card)) {
        // 将当前牌面置空
        user_choosed_card = [];

        var text = current_user.name + '继续出牌';
        setTimeout(function () {
            $('.modal .content').html(text);
            $('.modal').show().find('.content').fadeIn(1000);
        }, 500);
        setTimeout(function () {
            $('.modal').find('.content').fadeOut(300);
            $('.modal').hide();
        }, 2000);
        // 继续出牌
        var i = current_user.index;
        if (i == 2) {
            realPlayerAutoChooseCard();
        } else {
            computerAutoPlay(i);
        }

        //牌出完了，游戏结束
    } else if (current_user.cards.length == 0) {
        var text = current_user.role + '获胜<button class="btn btn-submit btn-onemore" onclick="oneMoreGame(this,event)">再来一局</button>';
        setTimeout(function () {
            $('.modal .content').html(text).css('height', '200px');
            $('.modal').show().find('.content').fadeIn(1000);
        }, 500);

    } else {
        // 将当前牌面置空
        user_choosed_card = [];
        // 切换到下一个玩家
        var i = current_user.index;
        if (i == 1) {
            current_user = user2;
            changeBellPos(2);
            recoverButtons();
            realPlayerAutoChooseCard();
        } else if (i == 2) {
            current_user = user3;
            changeBellPos(3);
            disabledButtons();
            computerAutoPlay(3);
        } else {
            current_user = user1;
            changeBellPos(1);
            disabledButtons();
            computerAutoPlay(1);
        }
    }
}

// 玩家的按钮操作区置灰，且不可操作
function disabledButtons() {
    $('#control-area').find('.btn').attr('disabled', 'disabled');
}

// 玩家的按钮操作区恢复，可操作
function recoverButtons() {
    $('#control-area').find('.btn').removeAttr('disabled');
}

// 出牌闹钟的位置
function changeBellPos(index) {
    var left, right, top;
    if (index == 1) {
        left = '200px';
        right = 'auto';
        top = '200px';
    } else if (index == 2) {
        left = '48%';
        right = 'auto';
        top = '400px';
    } else {
        left = 'auto';
        right = '200px';
        top = '200px';
    }
    $('.bell').css({
        "left": left,
        "right": right,
        "top": top
    });
}

// 电脑玩家自动出牌
function computerAutoPlay(index) {
    setTimeout(function () {
        var curr_player,newCards=[];
        index == 1?curr_player=user1:curr_player=user3;
        autoChooseCard(index);
        if(user_choosed_card.length != 0){
            for(var i=0;i<curr_player.cards.length;i++){
                if($.inArray(curr_player.cards[i],user_choosed_card)<0){
                    newCards.push(curr_player.cards[i]);
                }
            }
            current_card = user_choosed_card;
            current_card_user = current_user;
            $('.current-card-username').html(current_card_user.name).parent().show();
            curr_player.cards = newCards;
            drawCurrentCards(user_choosed_card);
            drawComputorCards(index,curr_player.cards);
        }
        changeCurrentUser();
    },2000);
}

/** 牌型检测,返回对应牌型代号和牌面值
 * 1: 单牌
 * 2：对牌
 * 3：顺子
 * 4：连对
 * 5：飞机（51：AAABBB,52：AAABBBcd,53：AAABBBccdd,54：AAABBBCCCdef,55：AAABBBCCCddeeff）
 * 6：四张牌 炸弹
 * 7：  71：三带一，72：三带一对，73：三不带
 * 8   81：四带二张，82：四带两对
 * 10：王炸
 *
 * 默认传入的参数cards，是合法牌型，不再去判断不合法的情形
 * */

function checkType(cards) {
    var type = 0, value = 0;// 记录牌型，牌面值（例如顺子56789，那么牌面值为5；飞机77788869，牌面值为7）
    if (cards.length == 1) {
        type = 1;
        value = parseInt(cards[0].substring(1));
    } else if (cards.length == 2) {
        // 如果是王炸
        if (parseInt(cards[0].substring(1)) >= 20) {
            type = 10;
        } else {
            // 对子
            type = 2;
            value = parseInt(cards[0].substring(1));
        }
        // 只可能是三不带 AAA
    } else if (cards.length == 3) {
        type = 73;
        value = parseInt(cards[0].substring(1));
    } else if (cards.length >= 4) {
        // 三带一
        var a = isThreePlusOne(cards);
        // 三带二
        var b = isThreePlusTwo(cards);
        // 四张炸弹
        var c = isBomb(cards);
        // 四带二
        var d = isBombWithCards(cards);
        // 顺子
        var e = isContinuousCards(cards);
        // 飞机
        var f = isPlaneWithCards(cards);
        // 连对
        var g = isContinuousPairCards(cards);

        if (a) {
            type = 71;
            value = a;
        } else if (b) {
            type = 72;
            value = b;
        } else if (c) {
            type = 6;
            value = c;
        } else if (d) {
            if (cards.length == 6) {
                type = 81;
            } else if (cards.length == 8) {
                type = 82;
            }
            value = d;
        } else if (e) {
            type = 3;
            value = e;
        } else if (f) {
            if (cards.length == 6) {
                type = 51;
            } else if (cards.length == 8) {
                type = 52;
            } else if (cards.length == 10) {
                type = 53;
            } else if (cards.length == 12) {
                type = 54;
            } else if (cards.length == 15) {
                type = 55;
            }
            value = f;
        } else if (g) {
            type = 4;
            value = g;
        }
    }
    return {"type": type, "value": value}
}

//判断是否等差为1的数列
function isContinuousNumber(arr) {
    for (var i = 0; i + 1 < arr.length; i++) {
        // 比较隔一张是否等差1
        if (arr[i] + 1 != arr[i + 1]) {
            return false
        }
    }
    return true
}

// 找出对象中value为指定值的key大于指定值的最小的项,如{3:1,4:2,5:2,6:1，8:2},值为2且key比5大的的最小的key是8
function findMinKeyInObject(val, vsVal, obj) {
    var minKey = 100; //预设一个很大的值，因为牌面最大数为大王的21，所以100足够
    //
    $.each(obj, function (key, value) {
        if (value == val) {
            if (minKey > parseInt(key) && parseInt(key) > vsVal) {
                minKey = parseInt(key);
            }
        }
    });
    // 如果上家是对手，就拆牌压制；队友的话不要；
    if (current_card_user.role == current_user.role) {
        if (minKey == 100) {
            return false
        } else {
            return minKey
        }
    } else {
        // 如果没有相同牌型的大于桌面的，则尝试其他更多相同牌的拆分压制;
        // 比如对面出一张A，我这边有一对2的话，第一个循环会认为要不起，因为只考虑当前的单牌中是否有大于A的；
        // 不拆炸彈
        if (minKey == 100) {
            $.each(obj, function (key, value) {
                if (parseInt(key) > vsVal && value > val && minKey > parseInt(key) && value != 4) {
                    minKey = parseInt(key);
                }
            });

            return minKey == 100 ? false : minKey
        } else {
            return minKey
        }
    }
}

// 找出当前用户牌中的大于指定牌的炸弹
function findBombInCurrentUserCard(val, obj) {
    var minBomb = false;
    $.each(obj, function (key, value) {
        if (value == 4 && parseInt(key) > val) {
            minBomb = parseInt(key);
            return
        }
    });
    return minBomb
}

// 查看是否有王炸
function findBigBangInCard(obj) {
    var num = 0;
    $.each(obj, function (key, value) {
        if (key >= 20) {
            num++;
        }
    });
    return num === 2
}

// 用炸弹压制对面的牌的流程(如果对面也是炸弹就传入值val)
function bombBang(val,cards,dom) {
    // 如果上家是对手，就拆牌压制；队友的话不要；
    if (current_card_user.role === current_user.role) {
        showTip('不 要');
        return
        // 如果对手出的牌不是炸弹，且还剩5张以上的牌，则不用炸弹压制
    }else if(val === 0 && current_card_user.cards.length>5){
        showTip('不 要');
        return
    }
    var v = findBombInCurrentUserCard(val, cards);
    if (v) {
        for (var i = 0; i < current_user.cards.length; i++) {
            if (v == current_user.cards[i].substring(1)) {
                dom.eq(i).addClass('pre-card');
                user_choosed_card.push(dom.eq(i).attr('card'));
            }
        }
    } else if (findBigBangInCard(cards)) {
        for (var i = 0; i < current_user.cards.length; i++) {
            if (current_user.cards[i].substring(1) >= 20) {
                dom.eq(i).addClass('pre-card');
                user_choosed_card.push(dom.eq(i).attr('card'));
            }
        }
    } else {
        showTip('不 要');
    }
}

// 飞机/炸弹带排的规则;
// type：1/2 带的是单牌还是对子
// 带牌组数：num = 2/3

function bringCards(array, type, num,obj) {
    if (!num) {
        num = 2;
    }
    if (!type) {
        type = 1;
    }
    // 取单牌前，先去掉飞机的牌值
    var obj = JSON.parse(JSON.stringify(obj));
    for (var i in array) {
        delete obj[array[i]]
    }
    var s1 = findMinKeyInObject(type, 0, obj);
    var s2 = findMinKeyInObject(type, s1, obj);
    if (num == 3) {
        var s3 = findMinKeyInObject(type, s2, obj);
        if (s1 && s2 && s3) {
            return [s1, s2, s3]
        }
    } else {
        if (s1 && s2) {
            return [s1, s2]
        }
    }
    return false
}


/**============================== 四张以上的牌型判断  Start==================================*/

/** 王炸 */
function isBigBang(arr) {
    if (arr.length == 2) {
        if (parseInt(arr[0].substring(1)) >= 20 && parseInt(arr[1].substring(1)) >= 20) {
            return true;
        }
    }
    return false
}

/** 炸弹(不含王炸) */
function isBomb(arr) {
    if (arr.length == 4) {
        return arr[0].substring(1) === arr[1].substring(1) && arr[1].substring(1) === arr[2].substring(1) && arr[2].substring(1) === arr[3].substring(1);
    }
    return false
}

/** 三带一
 * type: AAA b
 * 不是则返回false，如果是则返回三带牌的值
 */
function isThreePlusOne(array) {
    var arr = [];
    if(array.length != 4){
        return false
    }
    for (var i = 0; i < array.length; i++) {
        var item = parseInt(array[i].substring(1));
        arr.push(item);
    }
    // 排序
    arr.sort(function (a, b) {
        return a - b
    });
    // 前三张或后三张相等，则是三带一
    if (arr[0] == arr[1] && arr[1] == arr[2] && arr[2] != arr[3]) {
        return arr[0]
    } else if (arr[1] == arr[2] && arr[2] == arr[3] && arr[1] != arr[0]) {
        return arr[1]
    } else {
        return false
    }
}

/** ====三带一对====
 * type: AAA bb,
 * 不是则返回false，如果是则返回三带牌的值
 */
function isThreePlusTwo(array) {
    var arr = [];
    if(array.length != 5){
        return false
    }
    for (var i = 0; i < array.length; i++) {
        var item = parseInt(array[i].substring(1));
        arr.push(item);
    }
    // 排序
    arr.sort(function (a, b) {
        return a > b ? 1 : -1
    });
    // 前三张或后三张相等，且其他两张是相等的一对，则是三带一对
    if (arr[0] == arr[1] && arr[1] == arr[2] && arr[3] == arr[4]) {
        return arr[0]
    } else if (arr[2] == arr[3] && arr[3] == arr[4] && arr[0] == arr[1]) {
        return arr[2]
    } else {
        return false
    }
}

/** ====四带====
 * type: AAAA bc,   AAAA bb cc
 * 不是则返回false，如果是则返回炸弹牌的值
 */
function isBombWithCards(array) {
    if (array.length == 8 || array.length == 6) {
        return false
    } else {
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            var item = parseInt(array[i].substring(1));
            arr.push(item);
        }
        // 升序排序
        arr.sort(function (a, b) {
            return a > b ? 1 : -1
        });
        // 先确认是否有炸弹
        // 先将牌放入一个对象中，例如 牌是 四个6带一个8带一个9  666698，
        // 那么这个对象就是{6:4, 9:1, 8:1}, key为牌，value为相同牌的张数

        var divideCards = {}, divideCount = 0; //divideCount表示这个对象的长度（几组数据）
        var bombCard;
        for (var j = 0; j < arr.length; j++) {
            if (divideCards[arr[j]]) {
                divideCards[arr[j]]++;
            } else {
                divideCards[arr[j]] = 1;
            }
        }
        // 查看是否有炸弹，对子
        var hasBomb = false;
        var hasPair = false;
        for (var key in divideCards) {
            if (divideCards[key] == 4) {
                hasBomb = true;
                bombCard = parseInt(key);
            }
            if (divideCards[key] == 2) {
                hasPair = true;
            }
            divideCount++;
        }
        //如果有炸弹了，再看剩下的牌是否满足条件
        if (hasBomb) {
            // 如果是6张，且带两张单，返回ok
            if (arr.length == 6 && divideCount == 3) {
                return bombCard
            } else if (arr.length == 8 && divideCount == 3 && hasPair) {
                return bombCard
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

/** ===飞机带牌====
 * type: AAABBB,  AAABBB c d,   AAABBB cc dd
 * 三飞机四飞机都要考虑。。。
 * 不是则返回false，如果是则返回飞机中A的值
 */
function isPlaneWithCards(array) {
    if (array.length < 6) {
        return false
    } else {
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            var item = parseInt(array[i].substring(1));
            arr.push(item);
        }
        // 升序排序
        arr.sort(function (a, b) {
            return a > b ? 1 : -1
        });
        // 先确认是否有飞机
        // 先将牌放入一个对象中，例如 牌是 三个6三个7 带一8 带一9  66677798，
        // 那么这个对象就是{6:3, 7:3, 9:1, 8:1}, key为牌，value为相同牌的张数

        var divideCards = {}, divideCount = 0; //divideCount表示这个对象的长度（几组数据）
        for (var j = 0; j < arr.length; j++) {
            if (divideCards[arr[j]]) {
                divideCards[arr[j]]++;
            } else {
                divideCards[arr[j]] = 1;
            }
        }
        // 查看是否有飞机，对子
        var hasPlane = 0;
        var hasPair = 0;
        var planeCards = []; // 记录下组成飞机的牌的值
        for (var key in divideCards) {
            if (divideCards[key] == 3) {
                planeCards.push(parseInt(key));
                hasPlane++;
            }
            if (divideCards[key] == 2) {
                hasPair++;
            }
            divideCount++;
        }
        // 要有至少两组张数是3的牌，且这多组牌的数字是连续的
        //如果有飞机了，再看剩下的牌是否满足条件
        if (hasPlane >= 2 && isContinuousNumber(planeCards)) {
            // 当前牌的总组数不大于飞机牌的组数的两倍，带的牌必须是同一类型，（要么都是对子要么都是单牌，且带牌组数和飞机组数相等或不带牌）则OK
            if (hasPlane * 2 >= divideCount && (hasPair == hasPlane || hasPair == 0)) {
                return planeCards[0]
            } else {
                return false
            }
        } else {
            return false
        }
    }
}

/** ====连对====
 * 否返回false，如果是则返回连对的第一张牌的牌值
 */
function isContinuousPairCards(array) {
    // 如果不是偶数张，或张数小于6，直接错误
    if (array.length % 2 != 0 || array.length < 6) {
        return false
    } else {
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            var item = parseInt(array[i].substring(1));
            arr.push(item);
        }
        // 升序排序
        arr.sort(function (a, b) {
            return a - b 
        });
        // 连对不能有2或者王(排序后只需要判断最后一张牌是否大于等于2的值)
        if (arr[arr.length - 1] > 14) {
            return false
        }
        for (var i = 0; i < arr.length-1; i += 2) {
            // 比较相邻两个是否相等
            if (arr[i] != arr[i + 1]) {
                return false
            }
            if(i<arr.length-2){
                // 比较隔两张是否等差1
                if (arr[i] + 1 != arr[i + 2]) {
                    return false
                }
            }
        }
        return arr[0]
    }
}

/** 是否是顺子
 * type: 3 4 5 6 7
 * 否返回false，如果是则返回顺子的第一张牌的牌值
 */
function isContinuousCards(array) {
    // 如果张数小于5，直接错误
    if (array.length < 5) {
        return false
    } else {
        var arr = [];
        for (var i = 0; i < array.length; i++) {
            var item = parseInt(array[i].substring(1));
            arr.push(item);
        }
        // 升序排序
        arr.sort(function (a, b) {
            return a - b
        });
        // 顺子不能有2或者王(排序后只需要判断最后一张牌是否大于等于2的值)
        if (arr[arr.length - 1] > 14) {
            return false
        }
        for (var i = 0; i + 1 < arr.length; i++) {
            // 比较隔一张是否等差1
            if (arr[i] + 1 != arr[i + 1]) {
                return false
            }
        }
        return arr[0]
    }
}

/**============================== 牌型判断  End==================================*/


function showTip(text) {
    $('.tip').html(text).fadeIn();
    setTimeout(function () {
        $('.tip').fadeOut();
    },2000)
}