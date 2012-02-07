function processFeed(obj){
    
    //config
    var search_statuses=true;
    var search_photos=true;
    var search_videos=true;
    var search_links=true;
    //profile photo size : small/normal/square/large
    var photo_size='large';
    
    
    var str;
    $("older_holder").style.display='';
    toggle($('status'));
    watch_scroll();
    if (obj.data[0]){
        if (obj.paging.next) window.older=obj.paging.next;
        for (i=0;i<obj.data.length;i++){
            var o=obj.data[i];
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
                str+='<b>Photo:</b> :'
                var msg;
                if (!(typeof o.message == "undefined")) msg=o.message;//str+='<a class="fb_message" href="">'+o.message+'</a>';
                else if (!(typeof o.caption == "undefined")) msg=o.caption;//str+='<a class="fb_message" href="'+o.link+'">'+o.caption+'</a>';
                if (msg.length>100){
                    msg=msg.substr(0, 95)+'...';
                }
                str+='<a class="fb_message" target="_blank" href="'+o.link+'">'+msg+'</a>';
            //
            }else if (search_videos && o.type=='video'){
                //if (!(typeof o.message == "undefined")) str+='<span class="fb_message">'+o.message+'</span>';
                //if (!(typeof o.description == "undefined")) str+='<span class="fb_description">('+o.description+')</span>';
                console.log(o);
                var url=o.source;
                //url = url.source.replace('autoplay=1','autoplay=0');
                //str+='<iframe src="'+url+'"><a target="_blank" href="'+url+'"></a></iframe>'
                if (typeof o.picture == "undefined") o.picture='';//prevents undefined
                str+='<a class="video_link" style="background: #fff url('+o.picture+');" target="_blank" href="'+o.link+'" onclick="this.removeChild(this.firstChild);this.innerHTML=\'<iframe width=400 height=265 src='+url+'></iframe>\';return false;"><img src="http://static.ak.fbcdn.net/rsrc.php/v1/yr/r/XXVvDYAks_i.png"></a>';
                str+='<b>Video: </b>';        
                if (!(typeof o.name == "undefined"))  str+='<span class="fb_name">'+o.name+'</span>';
            }else if (search_statuses && o.type=='status'){
                str+='<span class="fb_message">'+o.message+'</span>';
            }
            
            
            if (str!=''){//if there is anything, create row and append string to it
                str='<span class="from"><a href="http://www.facebook.com/profile.php?id='+o.from.id+'" target="_blank"><img src="http://graph.facebook.com/'+o.from.id+'/picture?type='+photo_size+'"></a><a class="name" href="http://www.facebook.com/profile.php?id='+o.from.id+'" target="_blank">'+o.from.name+'</a></span>'+str;
                str+='<div class="fb_metadata"><span class="fb_time">'+o.created_time+'</span>';
                if (!(typeof o.application == "undefined")) {
                    if (o.application !=null && o.application.name !='Links' && o.application.name !='Likes' && o.application.name !='Photos' ) str+='<span class="via"> via '+o.application.name+'</span>';
                }
                str+='</div>';
                row.innerHTML=str;
                //console.log(o);
                $('result').appendChild(row);
            }
            
        }
        if(obj.data.length!=25) $("older_holder").innerHTML='<span id="message">No more results!</span>';
    }
    else{
        $("older_holder").innerHTML='<span id="message">No more results!</span>';
    }

}



function cl(a){
    console.log(a);
}

function $(a){
    return document.getElementById(a);
}


function toggle(a){
    a.style.display=(a.style.display=='')?'none':'';
}


function doSearch(query){
    window.msg="No search results for "+query+"!";
    addJS('http://graph.facebook.com/search/?limit=25&q='+query+'&callback=processFeed');

}

function addJS(file){
    //create a <script> tag
    file=file.replace(' ', "%20");
    file=file.replace('+0000', '');

    var s = document.createElement('script');
    //set its type attribute
    s.type = 'text/javascript';
    //set its source
    s.src = file+'&t='+ (+new Date());
    //find the first head tag and append the script tag as its child
    document.getElementsByTagName('head')[0].appendChild(s);
    window.current=file;
    
}


function watch_scroll(){
    setTimeout('watch_scroll()', 150);
    if ($('status').style.display=='') return;
    var wh = window.innerHeight ? window.innerHeight : document.body.clientHeight;
    var total = (document.body.scrollHeight - wh);
    var remain = total - document.body.scrollTop;
    if (window.current!=window.older && window.older && remain<200) showOlder();
}

function showOlder(){
    toggle($('status'));
    addJS(window.older);
}