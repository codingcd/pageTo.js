
/*
	分页插件
	实现的功能，传入数据，返回分页后的数据用于填充表格，能自定义分页组件的样式
	传入参数：分页控件所属盒子，后台返回的总数据，空间样式，绘制表格的函数
*/
function pageTo(pageControler,data,pageStyle,fn){
	var pageOpt = {
		mag_count:data.length+1,  // 数据总条数
		page_count:Math.ceil((data.length + 1)/10), // 总页数
		page_size:10, // 每页显示条数
		page_location:1,  // 当前位置
		start:0,     // 当前数据开始位置
		end:10,      // 数据结束位置
		page_to:""  // 跳转到第几页
	}
	// 返回的数据
	var result = [];
	// 转化pageStyle格式
	var pageStyleOut = (function(pageStyleOpt){
		var pageStyleObj = {
			pageBox:"",
			btn:"",
			pageMsg:"",
			pageLocation:"",
			textInput:""
		}
		pageStyleObj.pageBox = JSON.stringify(pageStyleOpt.pageBox).replace(/,/g,";").replace(/{/g,"").replace(/}/g,"").replace(/"/g,"");
		pageStyleObj.btn = JSON.stringify(pageStyleOpt.btn).replace(/,/g,";").replace(/{/g,"").replace(/}/g,"").replace(/"/g,"");
		pageStyleObj.textInput = JSON.stringify(pageStyleOpt.textInput).replace(/,/g,";").replace(/{/g,"").replace(/}/g,"").replace(/"/g,"");
		pageStyleObj.pageMsg = JSON.stringify(pageStyleOpt.pageMsg).replace(/,/g,";").replace(/{/g,"").replace(/}/g,"").replace(/"/g,"");
		pageStyleObj.pageLocation = JSON.stringify(pageStyleOpt.pageLocation).replace(/,/g,";").replace(/{/g,"").replace(/}/g,"").replace(/"/g,"");
		return pageStyleObj;
	})(pageStyle)
	// 定义分页函数
	pageFn(pageControler,pageOpt,data,pageStyleOut);
	function pageFn(pageControler,pageOpt1,data,pageStyleOpt){
		var pageComponent = '<div style="'+
			pageStyleOut.pageBox +'"><select id="pageSize" style="'+
			pageStyleOut.textInput+';padding-left:1px;width:48px;'+'height:'+
			pageStyle.btn.height+'">'+
				'<option>10</option>'+
				'<option>20</option>'+
				'<option>30</option>'+
				'<option>100</option>'+
			'</select><button id="pageStart" style="'+
			pageStyleOut.btn+';background:#ddd""><i class="fa fa-angle-double-left"></i></button><button id="pageUp" style="'+
			pageStyleOut.btn+';background:#ddd"><i class="fa fa-angle-left"></i></button><span style="'+
			pageStyleOut.pageMsg+'">&nbsp;第&nbsp;<span id="pageLocal" style="'+
			pageStyleOut.pageLocation+'">'+
			pageOpt.page_location+'</span>/<span id="pageCount">'+
			pageOpt.page_count+'</span>&nbsp;页</span><button id="pageDown" style="'+
			pageStyleOut.btn+'"><i class="fa fa-angle-right"></i></button><button id="pageEnd" style="'+
			pageStyleOut.btn+'"><i class="fa fa-angle-double-right"></i></button><input id="pageTarg" type="text" value="'+
			pageOpt.page_to+'" style="display:inline-block;'+
			pageStyleOut.textInput+'" /><button id="jump" style="'+
			pageStyleOut.btn+';width:48px">跳转</button>&nbsp;&nbsp;<span style="'+
			pageStyleOut.pageMsg+'">共&nbsp;'+
			pageOpt.mag_count+'&nbsp;条数据</span</div>'
		pageControler.innerHTML = pageComponent;
		result = data.slice(pageOpt.start,pageOpt.end);
		fn(result);
		// 调用绘制表格的函数
	}
	// 改变每页显示条数调用的函数
	var pageSize = document.getElementById("pageSize");
	pageSize.onchange = function(){
		var oldEnd = pageOpt.end;
		pageOpt.page_size = pageSize.value*1;
		pageOpt.start = 0;
		pageOpt.end = pageOpt.end - oldEnd  + pageOpt.page_size;
		pageOpt.page_location = 1;
		pageOpt.page_count = Math.ceil((data.length + 1)/pageOpt.page_size);
		console.log(pageOpt)
		document.getElementById("pageLocal").innerText = 1;
		document.getElementById("pageCount").innerText = pageOpt.page_count;
		result = data.slice(pageOpt.start,pageOpt.end);
		fn(result);
	}
	// 点击首页按钮
	var pageStart = document.getElementById("pageStart");
	pageStart.onclick = function(){
		pageDown.style.backgroundColor = pageStyle.btn.background;
		pageUp.style.backgroundColor = "#ddd";
		pageStart.style.backgroundColor = "#ddd";
		pageEnd.style.backgroundColor = pageStyle.btn.background;
		if(pageOpt.page_location != 1){
			pageOpt.start = 0;
			pageOpt.end = pageOpt.start + pageOpt.page_size;
			pageOpt.page_location = 1;
			document.getElementById("pageLocal").innerText = 1;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}
	}
	// 点击尾页按钮
	var pageEnd = document.getElementById("pageEnd");
	pageEnd.onclick = function(){
		pageUp.style.backgroundColor = pageStyle.btn.background;
		pageDown.style.backgroundColor = "#ddd";
		pageStart.style.backgroundColor = pageStyle.btn.background;
		pageEnd.style.backgroundColor = "#ddd";
		if(pageOpt.page_location < pageOpt.page_count){
			pageOpt.start = (pageOpt.page_count-1)*pageOpt.page_size;
			pageOpt.end = pageOpt.start + pageOpt.page_size;
			pageOpt.page_location = pageOpt.page_count;
			document.getElementById("pageLocal").innerText = pageOpt.page_location;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}
	}
	// 点击上一页按钮
	var pageUp = document.getElementById("pageUp");
	pageUp.onclick = function(){
		pageDown.style.backgroundColor = pageStyle.btn.background;
		pageEnd.style.backgroundColor = pageStyle.btn.background;
		var oldStart = pageOpt.start;
		var oldLocation = pageOpt.page_location;
		if(pageOpt.page_location != 1){
			pageOpt.page_location = oldLocation -1;
			document.getElementById("pageLocal").innerText = pageOpt.page_location;
			pageOpt.start = oldStart - pageOpt.page_size;
			pageOpt.end = oldStart;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}
		if(pageOpt.page_location == 1){
			pageUp.style.backgroundColor = "#ddd";
			pageStart.style.backgroundColor = "#ddd";
			
		}else{
			pageUp.style.backgroundColor = pageStyle.btn.background;
		}
		
	}
	// 点击下一页按钮
	var pageDown = document.getElementById("pageDown");
	pageDown.onclick = function(){
		pageUp.style.backgroundColor = pageStyle.btn.background;
		pageStart.style.backgroundColor = pageStyle.btn.background;
		var oldEnd = pageOpt.end;
		var oldLocation = pageOpt.page_location;
		if(pageOpt.page_location < pageOpt.page_count){
			pageOpt.page_location = oldLocation+1;
			document.getElementById("pageLocal").innerText = pageOpt.page_location;
			pageOpt.start = oldEnd;
			pageOpt.end = oldEnd + pageOpt.page_size;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}
		if(pageOpt.page_location == pageOpt.page_count){
			pageDown.style.backgroundColor = "#ddd";
			pageEnd.style.backgroundColor = "#ddd";
		}else{
			pageDown.style.backgroundColor = pageStyle.btn.background;
		}
	}
	// 点击跳转按钮
	var jump = document.getElementById("jump");
	jump.onclick = function(){
		// 获取跳转输入框的值
		var pageTargNum = document.getElementById("pageTarg").value*1;
		if(pageTargNum>=pageOpt.page_count){  // 输入大于总页数，跳转到尾页
			pageUp.style.backgroundColor = pageStyle.btn.background;
			pageDown.style.backgroundColor = "#ddd";
			pageStart.style.backgroundColor = pageStyle.btn.background;
			pageEnd.style.backgroundColor = "#ddd";
			pageOpt.start = (pageOpt.page_count-1)*pageOpt.page_size;
			pageOpt.end = pageOpt.start + pageOpt.page_size;
			pageOpt.page_location = pageOpt.page_count;
			document.getElementById("pageLocal").innerText = pageOpt.page_location;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}else if(pageTargNum<=1){  // 输入小于1，跳转到首页
			pageDown.style.backgroundColor = pageStyle.btn.background;
			pageUp.style.backgroundColor = "#ddd";
			pageStart.style.backgroundColor = "#ddd";
			pageEnd.style.backgroundColor = pageStyle.btn.background;
			pageOpt.start = 0;
			pageOpt.end = pageOpt.start + pageOpt.page_size;
			pageOpt.page_location = 1;
			document.getElementById("pageLocal").innerText = 1;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}else{ // 正常输入跳转
			pageUp.style.backgroundColor = pageStyle.btn.background;
			pageStart.style.backgroundColor = pageStyle.btn.background;
			pageDown.style.backgroundColor = pageStyle.btn.background;
			pageEnd.style.backgroundColor = pageStyle.btn.background;
			pageOpt.start = (pageTargNum-1)*pageOpt.page_size;
			pageOpt.end = pageOpt.start + pageOpt.page_size;
			pageOpt.page_location = pageTargNum;
			document.getElementById("pageLocal").innerText = pageTargNum;
			result = data.slice(pageOpt.start,pageOpt.end);
			fn(result);
		}
	}
}