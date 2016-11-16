// ==UserScript==
// @name         EasyGoEnhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/maoger/EasyGoEnhancer
// @version      1.1
// @description  重整EasyGo代办事项
// @author       Mao Yanqing
// @match        http://www.ascendacpa.com.cn/*
// @require      http://code.jquery.com/jquery-3.1.1.js
// @updateURL    https://openuserjs.org/meta/maoger/Copyer.meta.js

// ==/UserScript==

function getTodoList ($content) {
    return Array.prototype.map.call($content, function ($tabContent, index) {
        var $table = $tabContent.children[0].children[0];
        if ($table === undefined) return;
        return Array.prototype.map.call(
            $table.querySelectorAll('tr'),
            function ($tr, i) {
                if (i>0) {
                    return $tr;
                }
            }).filter(function(a){if (a) return true;});
    }).filter(function(a){if (a) return true;});
}

function DoIt() {
    'use strict';

    // 删除首页中“待办事项”后面的伪Tags：
    var FakeTags = document.querySelector('.NewTitle1');
    for (var i = 4; i >= 0; i--) {
        FakeTags.removeChild(FakeTags.children[1]);
    }

    // 增加容器，并插入到“待办事项”标题下:
    // 以下为为了使用 insertBefore 而进行定位查找相关元素：
    var MaoList = $(".contPage");
    var MaoTitle = $(".newfooter");

    var todoUrl = "http://www.ascendacpa.com.cn/MoreTask3.aspx?ind=1";
    $.get(todoUrl, function (content) {
        var $content = $(content).find('[id*=tabContent__]');
        var todoList = getTodoList($content);
        var docfrag = document.createDocumentFragment();
        var div$ = document.createElement('div');
        var table$ = document.createElement('table');
        var tbody$ = document.createElement('tbody');

        docfrag.appendChild(div$);
        div$.appendChild(table$);
        table$.appendChild(tbody$);

        Array.prototype.map.call(todoList, function(todo) {
            Array.prototype.map.call(todo, function(item) {
                tbody$.appendChild(item);
            });
        });
        FakeTags.parentElement.insertBefore(docfrag, FakeTags.nextElementSibling);
    });

    return;
}
(function() {
    var btn = document.createElement('button');
    btn.onclick = DoIt;
    btn.innerHTML = 'Do It';
    btn.style.position = 'fixed';
    btn.style.top = 0;
    btn.style.right = 0;
    document.body.appendChild(btn);
})();
