async function loadImages(){

const res=await fetch("/api/images");

const data=await res.json();

const gallery=document.getElementById("gallery");

gallery.innerHTML="";

data.forEach(img=>{

gallery.innerHTML+=`

<div class="card">

<img src="/uploads/${img.filename}">

<h3>${img.originalname}</h3>

<a
class="download"
href="/download/${img.filename}"
>

Download

</a>

</div>

`;

});

}

loadImages();