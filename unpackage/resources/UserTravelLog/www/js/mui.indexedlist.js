/**
 * IndexedList
 * 类似联系人应用中的联系人列表，可以按首字母分组
 * 右侧的字母定位工具条，可以快速定位列表位置
 * varstion 1.0.0
 * by Houfeng
 * Houfeng@DCloud.io
 **/

(function($, window, document) {

	var keywordGlobal = "";
	var classSelector = function(name) {
		return '.' + $.className(name);
	}

	var IndexedList = $.IndexedList = $.Class.extend({
		/**
		 * 通过 element 和 options 构造 IndexedList 实例
		 **/
		init: function(holder, options) {
			var self = this;
			self.options = options || {};
			self.box = holder;
			if (!self.box) {
				throw "实例 IndexedList 时需要指定 element";
			}
			self.createDom();
			self.findElements();
			self.caleLayout();
			self.bindEvent();
		},
		createDom: function() {
			var self = this;
			self.el = self.el || {};
			//styleForSearch 用于搜索，此方式能在数据较多时获取很好的性能
			self.el.styleForSearch = document.createElement('style');
			(document.head || document.body).appendChild(self.el.styleForSearch);
		},
		findElements: function() {
			var self = this;
			self.el = self.el || {};
			self.el.search = self.box.querySelector(classSelector('indexed-list-search'));
			self.el.searchInput = self.box.querySelector(classSelector('indexed-list-search-input'));
			self.el.searchClear = self.box.querySelector(classSelector('indexed-list-search') + ' ' + classSelector(
				'icon-clear'));
			self.el.bar = self.box.querySelector(classSelector('indexed-list-bar'));
			self.el.barItems = [].slice.call(self.box.querySelectorAll(classSelector('indexed-list-bar') + ' a'));
			self.el.inner = self.box.querySelector(classSelector('indexed-list-inner'));
			self.el.items = [].slice.call(self.box.querySelectorAll(classSelector('indexed-list-item')));
			self.el.liArray = [].slice.call(self.box.querySelectorAll(classSelector('indexed-list-inner') + ' li'));
			self.el.alert = self.box.querySelector(classSelector('indexed-list-alert'));
		},
		caleLayout: function() {
			var self = this;
			var withoutSearchHeight = (self.box.offsetHeight - self.el.search.offsetHeight) + 'px';
			self.el.bar.style.height = withoutSearchHeight;
			self.el.inner.style.height = withoutSearchHeight;
			var barItemHeight = ((self.el.bar.offsetHeight - 40) / self.el.barItems.length) + 'px';
			self.el.barItems.forEach(function(item) {
				item.style.height = barItemHeight;
				item.style.lineHeight = barItemHeight;
			});
		},
		scrollTo: function(group) {
			var self = this;
			var groupElement = self.el.inner.querySelector('[data-group="' + group + '"]');
			if (!groupElement || (self.hiddenGroups && self.hiddenGroups.indexOf(groupElement) > -1)) {
				return;
			}
			self.el.inner.scrollTop = groupElement.offsetTop;
		},
		bindBarEvent: function() {
			var self = this;
			var pointElement = null;
			var findStart = function(event) {
				if (pointElement) {
					pointElement.classList.remove('active');
					pointElement = null;
				}
				self.el.bar.classList.add('active');
				var point = event.changedTouches ? event.changedTouches[0] : event;
				pointElement = document.elementFromPoint(point.pageX, point.pageY);
				if (pointElement) {
					var group = pointElement.innerText;
					if (group && group.length == 1) {
						pointElement.classList.add('active');
						self.el.alert.innerText = group;
						self.el.alert.classList.add('active');
						self.scrollTo(group);
					}
				}
				event.preventDefault();
			};
			var findEnd = function(event) {
				self.el.alert.classList.remove('active');
				self.el.bar.classList.remove('active');
				if (pointElement) {
					pointElement.classList.remove('active');
					pointElement = null;
				}
			};
			self.el.bar.addEventListener($.EVENT_MOVE, function(event) {
				findStart(event);
			}, false);
			self.el.bar.addEventListener($.EVENT_START, function(event) {
				findStart(event);
			}, false);
			document.body.addEventListener($.EVENT_END, function(event) {
				findEnd(event);
			}, false);
			document.body.addEventListener($.EVENT_CANCEL, function(event) {
				findEnd(event);
			}, false);
		},
		search: function(keyword) {
			var self = this;
			keywordGlobal = keyword;
			console.log(keywordGlobal);
			getTravelLogs({
				travelLogId: keywordGlobal + "",
				travelLogUser: keywordGlobal + "",
				travelLogTime: keywordGlobal + "",
				travelLogImg: keywordGlobal + "",
				travelLogTxt: keywordGlobal + "",
				travelLogPraise: keywordGlobal + ""
			});
			// 			keyword = (keyword || '').toLowerCase();
			// 			var selectorBuffer = [];
			// 			var groupIndex = -1;
			// 			var itemCount = 0;
			// 			var liArray = self.el.liArray;
			// 			var itemTotal = liArray.length;
			// 			self.hiddenGroups = [];
			// 			var checkGroup = function(currentIndex, last) {
			// 				if (itemCount >= currentIndex - groupIndex - (last ? 0 : 1)) {
			// 					selectorBuffer.push(classSelector('indexed-list-inner li') + ':nth-child(' + (groupIndex + 1) + ')');
			// 					self.hiddenGroups.push(liArray[groupIndex]);
			// 				};
			// 				groupIndex = currentIndex;
			// 				itemCount = 0;
			// 			}
			// 			liArray.forEach(function(item) {
			// 				var currentIndex = liArray.indexOf(item);
			// 				if (item.classList.contains($.className('indexed-list-group'))) {
			// 					checkGroup(currentIndex, false);
			// 				} else {
			// 					var text = (item.innerText || '').toLowerCase();
			// 					var value = (item.getAttribute('data-value') || '').toLowerCase();
			// 					var tags = (item.getAttribute('data-tags') || '').toLowerCase();
			// 					if (keyword && text.indexOf(keyword) < 0 &&
			// 						value.indexOf(keyword) < 0 &&
			// 						tags.indexOf(keyword) < 0) {
			// 						selectorBuffer.push(classSelector('indexed-list-inner li') + ':nth-child(' + (currentIndex + 1) + ')');
			// 						itemCount++;
			// 					}
			// 					if (currentIndex >= itemTotal - 1) {
			// 						checkGroup(currentIndex, true);
			// 					}
			// 				}
			// 			});
			// 			if (selectorBuffer.length >= itemTotal) {
			// 				self.el.inner.classList.add('empty');
			// 			} else if (selectorBuffer.length > 0) {
			// 				self.el.inner.classList.remove('empty');
			// 				self.el.styleForSearch.innerText = selectorBuffer.join(', ') + "{display:none;}";
			// 			} else {
			// 				self.el.inner.classList.remove('empty');
			// 				self.el.styleForSearch.innerText = "";
			// 			}
		},
		bindSearchEvent: function() {
			var self = this;
			self.el.searchInput.addEventListener('input', function() {
				var keyword = this.value;
				self.search(keyword);
			}, false);
			$(self.el.search).on('tap', classSelector('icon-clear'), function() {
				self.search('');
			}, false);
		},
		bindPullRefresh: function() {
			var self = this;
			document.getElementById('list').addEventListener("swipedown", function() {
				if (self.el.inner.scrollTop === 0) {
					getTravelLogs({
						travelLogId: keywordGlobal + "",
						travelLogUser: keywordGlobal + "",
						travelLogTime: keywordGlobal + "",
						travelLogImg: keywordGlobal + "",
						travelLogTxt: keywordGlobal + "",
						travelLogPraise: keywordGlobal + ""
					});
				}
			});
		},
		bindEvent: function() {
			var self = this;
			self.bindBarEvent();
			self.bindSearchEvent();
			self.bindPullRefresh();
		}
	});

	//mui(selector).indexedList 方式
	$.fn.indexedList = function(options) {
		//遍历选择的元素
		this.each(function(i, element) {
			if (element.indexedList) return;
			element.indexedList = new IndexedList(element, options);
		});
		return this[0] ? this[0].indexedList : null;
	};

})(mui, window, document);

function formatTime(time) {
	var date = new Date(time);
	var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()); // 在小于10的数字前加一个‘0’
	var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()); // 在小于10的数字前加一个‘0’
	var formatTime = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日  " + date.getHours() +
		":" + m + ":" + s;
	return formatTime;
}

function getTravelLogs(searchfieldObj) {
	plus.nativeUI.showWaiting();
	setTimeout(function() {
		var network = true;
		if (mui.os.plus) {
			mui.plusReady(function() {
				if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					network = false;
				}
			});
		}
		if (network) {
			mui.ajax(urlPre + 'travelLog/dimSelect', {
				data: searchfieldObj,
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					//服务器返回响应，根据响应结果，分析是否登录成功；
					console.log(JSON.stringify(data));
					if (data.success) {
						var travelLogs = data.data;
						var result = "";
						for (var i = 0; i < travelLogs.length; i++) {
							var temp = travelLogs[i];
							result +=
								"<li class='mui-table-view-cell mui-media'> <a href = 'javascript:;'><div class = 'mui-card'><div class = 'mui-card-header mui-card-media'><img src='" +
								urlPre + temp.user.userPortrait + "' onerror=src='images/zff.jpg'/><div class = 'mui-media-body'>" +
								temp.user.userName + "<p>发表于" + formatTime(temp.travelLogTime) +
								"</p></div></div><div class = 'mui-card-content'><img src = '" +
								urlPre + temp.travelLogImg +
								"' onerror=src='images/zff.jpg' alt='' width = '100%' /><div class = 'mui-card-content-inner'><p style = 'color: #333;'>" +
								temp.travelLogTxt +
								"</p> </div> </div> <div class = 'mui-card-footer'><a class = 'mui-card-link'> 关注 </a><a class = 'mui-card-link'> 赞（" +
								temp.travelLogPraise +
								"）</a><a class = 'mui-card-link' href = '#'> 评论（0） </a></div><div class = 'mui-collapse-content'>";
							for (var j = 0; j < temp.comments.length; j++) {
								result +=
									"<div class = 'mui-card-header mui-card-media'><img src = '" +
									urlPre + temp.comments[j].user.userPortrait +
									"' onerror=src='images/zff.jpg'/><div class = 'mui-media-body'><div class = 'mui-row'><span class = 'mui-col-sm-6 mui-col-xs-6' style = 'color: #0062CC;'>" +
									temp.comments[j].user.userName +
									"</span> <span class = 'mui-col-sm-6 mui-col-xs-6' style = 'color:lightgray; text-align:right;'>" +
									formatTime(temp.comments[j].commentsTime) +
									"</span></div><p style = 'color: #333;' >" + temp.comments[j].commentTxt + "</p></div></div>";
							}
							result +=
								"<form class = 'mui-input-group' style = 'margin: 5px;'><div class = 'mui-input-row' ><button type = 'button' class = 'mui-btn mui-btn-primary mui-col-sm-3 mui-col-xs-3' style = 'padding: 10px;'> 发表 </button> <input type = 'text' class = 'mui-col-sm-9 mui-col-xs-9' placeholder = '发表你的评论' style = 'padding-left: 5px; padding-right: 20px;'></div> </form></div></div></a></li>";
						}
						document.getElementById("ulTag").innerHTML = result;
						plus.nativeUI.closeWaiting();
					} else {
						plus.nativeUI.closeWaiting();
						plus.nativeUI.toast(data.describe + "。");
						return;
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					plus.nativeUI.closeWaiting();
					plus.nativeUI.toast("status：" + xhr.status + "；readyState：" + xhr.readyState + "；type：" + type +
						"；errorThrown：" +
						errorThrown);
					return;
				}
			});
		} else {
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast('当前网络不给力，请稍后再试');
			return;
		}
	}, 600);
}
