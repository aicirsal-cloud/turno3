const rotation=[
"manana","manana",
"tarde","tarde",
"noche","noche",
"libre","libre","libre","libre","libre","libre"
];

const startRotation=new Date("2026-03-22");

let currentDate=new Date();

let admin=false;

const ADMIN_PASSWORD="turno3admin";

function getShift(date){

let diff=Math.floor((date-startRotation)/86400000);

let index=((diff%rotation.length)+rotation.length)%rotation.length;

return rotation[index];

}

function capacity(date,shift){

let day=date.getDay();

if(shift==="noche") return 3;

if(day===0||day===6) return 3;

return 4;

}

document.getElementById("adminBtn").onclick=()=>{

let pass=prompt("Contraseña administrador");

if(pass===ADMIN_PASSWORD){

admin=true;

alert("Modo administrador activado");

}

};

function createCalendar(){

let year=currentDate.getFullYear();
let month=currentDate.getMonth();

let first=new Date(year,month,1);
let last=new Date(year,month+1,0);

let calendar=document.getElementById("calendar");

calendar.innerHTML="";

for(let d=1;d<=last.getDate();d++){

let date=new Date(year,month,d);

let shift=getShift(date);

let div=document.createElement("div");

div.className="day "+shift;

div.innerHTML="<b>"+d+"</b>";

div.onclick=()=>toggleDay(date,div);

calendar.appendChild(div);

}

document.getElementById("monthTitle").innerText=
dateToText(year,month);

}

function dateToText(y,m){

return new Date(y,m).toLocaleString("es",{month:"long",year:"numeric"});

}

function toggleDay(date,div){

let user=document.getElementById("userSelect").value;

if(!user) return;

let id=date.toISOString().split("T")[0];

let data=JSON.parse(localStorage.getItem(id)||"[]");

let index=data.indexOf(user);

if(index>-1){

data.splice(index,1);

}else{

data.push(user);

}

localStorage.setItem(id,JSON.stringify(data));

renderDay(div,data,date);

}

function renderDay(div,users,date){

let shift=getShift(date);

let max=capacity(date,shift);

let left=max-users.length;

let html="<b>"+date.getDate()+"</b><br>";

users.forEach(u=>{

html+=u+" ("+left+")<br>";

});

if(users.length>max){

html+='<div class="tooMany">¡DEMASIADOS APUNTADOS!</div>';

}

div.innerHTML=html;

}

document.getElementById("prevMonth").onclick=()=>{

currentDate.setMonth(currentDate.getMonth()-1);

createCalendar();

};

document.getElementById("nextMonth").onclick=()=>{

currentDate.setMonth(currentDate.getMonth()+1);

createCalendar();

};

document.getElementById("nextYear").onclick=()=>{

currentDate.setFullYear(currentDate.getFullYear()+1);

createCalendar();

};

document.getElementById("addUser").onclick=()=>{

let name=document.getElementById("newUser").value;

let select=document.getElementById("userSelect");

let option=document.createElement("option");

option.text=name;

select.add(option);

};

createCalendar();