var fb_older, fb_current,fb_msg,fb_count;
function processFeed(obj) {
    //config
    'use strict';
    var search_statuses = true;
    var search_photos = true;
    var search_videos = true;
    var search_links=true;
    //profile photo size : small/normal/square/large
    var photo_size='large';
    var str,o;
    $("older_holder").style.display='';
    toggle($('status'));
    toggle($('status1'));
    watch_scroll();
    if (obj.data[0]) {
        if (obj.paging.next) fb_older = obj.paging.next;
        for (var i=0;i<obj.data.length;i++){
            o=obj.data[i];
            str='';
            var row=document.createElement('div');
            row.className="fb_row";
            //picture types : small, normal, square, large
            if (search_links && o.type=='link'){
                str='<span class="fb_link"><a target="_blank" href="'+o.link+'">';
                if (!(typeof o.name == "undefined")) str+=o.name;
                str+='</a></span>';
            }
            else if (search_photos && o.type=='photo'){
                //str+='<span class="fb_photo"><img src="'+o.picture+'"></span>';
                str+='<b>Photo</b>: '
                var msg=' Click here to view photo!';
                if (!(typeof o.message == "undefined")) msg=o.message;
                else if (!(typeof o.caption == "undefined")) msg=o.caption;
                else if (!(typeof o.name == "undefined")) msg=o.name;
                if (msg.length>100){
                    msg=msg.substr(0, 95)+'...';
                }
                str+='<a class="fb_message" target="_blank" href="'+o.link+'">'+msg+'</a>';
            }else if (search_videos && o.type=='video'){
                //if (!(typeof o.message == "undefined")) str+='<span class="fb_message">'+o.message+'</span>';
                //if (!(typeof o.description == "undefined")) str+='<span class="fb_description">('+o.description+')</span>';
                var url=o.source;
                //url = url.source.replace('autoplay=1','autoplay=0');
                //str+='<iframe src="'+url+'"><a target="_blank" href="'+url+'"></a></iframe>'
                if (typeof o.picture == "undefined") o.picture='';//prevents undefined
                str+='<a class="video_link" style="background: #fff url('+o.picture+');" target="_blank" href="'+o.link+'" onclick="this.removeChild(this.firstChild);this.innerHTML=\'<iframe width=400 height=265 src='+url+'></iframe>\';return false;"><img src="http://static.ak.fbcdn.net/rsrc.php/v1/yr/r/XXVvDYAks_i.png"></a>';
                str+='<b>Video: </b>';        
                if (!(typeof o.name == "undefined"))  str+='<span class="fb_name">'+o.name+'</span>';
            }else if (search_statuses && o.type=='status'){
                msg=o.message;
                if (msg.length>900){
                    msg=msg.substr(0, 900)+'...';
                }
                str+='<span class="fb_message">'+msg+'</span>';
            }
            
            if (str!=''){//if there is anything, create row and append string to it
                str='<span class="from"><a href="http://www.facebook.com/profile.php?id='+o.from.id+'" target="_blank"><img src="http://graph.facebook.com/'+o.from.id+'/picture?type='+photo_size+'"></a><a class="name" href="http://www.facebook.com/profile.php?id='+o.from.id+'" target="_blank">'+o.from.name+'</a></span>'+str;
                str+='<div class="fb_metadata"><span class="fb_time">'+get_relative_time(format_time(o.created_time))+'</span>';
                if (!(typeof o.application == "undefined")) {
                    if (o.application !=null && o.application.name !='Links' && o.application.name !='Likes' && o.application.name !='Photos' ) str+='<span class="via"> via '+formatApp(o.application.name)+'</span>';
                }
                str+='</div>';
                row.innerHTML=str;
                $('result').appendChild(row);
            }
            
        }
        if(obj.data.length!=fb_count) $("older_holder").innerHTML='<span id="message">No more results!</span>';
        $('status').style.display='none';
        
    }
    else{
        $("older_holder").innerHTML='<span id="message">No more results!</span>';
    }

}

function $(a){
    return document.getElementById(a);
}


function toggle(a){
    if (a) a.style.display=(a.style.display=='')?'none':'';
}

function fbSearch(query,count){
    fb_count=count;
    if (typeof count == 'undefined') count=25;
    fb_msg="No search results for "+query+"!";
    addJS('http://graph.facebook.com/search/?limit='+count+'&q='+query+'&callback=processFeed');
}

function addJS(file){
    file=file.replace(' ', "%20");
    file=file.replace('+0000', '');
    //create a <script> tag
    var s = document.createElement('script');
    //set its type attribute
    s.type = 'text/javascript';
    //set its source, use Date to bypass cache
    s.src = file+'&t='+ (+new Date());
    //find the first head tag and append the script tag as its child
    document.getElementsByTagName('head')[0].appendChild(s);
    fb_current=file;
}

function watch_scroll(){
    setTimeout('watch_scroll()', 150);
    if ($('status').style.display=='') return;
    var wh = window.innerHeight ? window.innerHeight : document.body.clientHeight;
    var total = (document.body.scrollHeight - wh);
    var remain = total - document.body.scrollTop;
    if (fb_current!=fb_older && fb_older && remain<200) showOlder();
}

function showOlder(){
    toggle($('status'));
    toggle($('status1'));
    addJS(fb_older);
}

function formatApp(app){
    return app.replace('Share_bookmarklet','Share Bookmarklet');
}

function get_relative_time(time_value) {
    var time_lt1min = 'less than 1 min ago';
    var time_1min = '1 min ago';
    var time_mins = '%1 mins ago';
    var time_1hour = '1 hour ago';
    var time_hours = '%1 hours ago';
    var time_1day = '1 day ago';
    var time_days = '%1 days ago';
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);
    if (delta < 60) {
        return time_lt1min;
    } else if(delta < 120) {
        return time_1min;
    } else if(delta < (60*60)) {
        return time_mins.replace('%1', (parseInt(delta / 60)).toString());
    } else if(delta < (120*60)) {
        return time_1hour;
    } else if(delta < (24*60*60)) {
        return time_hours.replace('%1', (parseInt(delta / 3600)).toString());
    } else if(delta < (48*60*60)) {
        return time_1day;
    } else {
        return time_days.replace('%1', (parseInt(delta / 86400)).toString());
    }
}

function format_time(time_value){
    var time = new Date(time_value);
    time=time.toUTCString();
    var values = time.split(" ");
    return values[1] + " " + values[2] + ", " + values[4] + " " + values[3];
}