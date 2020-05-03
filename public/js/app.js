console.log('Testing javascript')


const weatherForm = document.querySelector('form'); //provides access to first match, in this case first form
const errorPara = document.getElementById('errorPara');
const successPara = document.querySelector('#successPara');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const search = document.querySelector('input').value;
    fetch("/weather?address="+search).then(res => {
    res.json().then((data)=>{
        if(data.error){
            errorPara.innerHTML=data.error;
            successPara.textContent='';
            //successPara.innerHTML = '';
        }
        else{
            errorPara.innerHTML='';
        successPara.innerHTML = data.summary;
    }
    })
})
})