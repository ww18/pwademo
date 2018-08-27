/**
 * Created by ww on 2018/7/26.
 */
var cacheName = 'ydPWA-step-v1';
var filesToCache = [
    '/index.css',
    '/images/timg.jpeg',
    '/index.html',
    '/'
];

function updateStaticCache(){
    return caches.open(cacheName)
        .then(function(cache){
            console.log(cache);
            return cache.addAll(filesToCache)
        })
        .then(()=>self.skipWaiting());
}
//self caches都是全局变量了
self.addEventListener('install', function(event){
    //首页访问会触发
    console.log('安装');
    event.waitUntil(updateStaticCache());
});
//匹配是否是新的
self.addEventListener('activate',function(event){
    event.waitUntil(caches.keys().then(function(keyList){
        return Promise.all(keyList.map(function(key){
            if(key !== cacheName){
                return caches.delete(key);
            }
        }))
    }))
})
self.addEventListener('fetch', function(event){
    console.log(event.request);
    //event.respondWith(new Response('hello PWA'));
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request)
        })
    )
})