window.onload= ()=>{
    const roverDropDown = document.getElementById('rover-dropdown');
    const dateDropDown = document.getElementById('date-dropdown');
    const cameraDropDown = document.getElementById('camera-dropdown');
    const mainelement= document.querySelector('main');
    const modalelement=document.getElementById('modal');
    

    const manifestUrl = 'https://api.nasa.gov/mars-photos/api/v1/manifests/';
    const imagesurl='https://api.nasa.gov/mars-photos/api/v1/rovers/';
    const apikey ='OBBDivitmb5Zgcadibdk5jMFbLNGGam33vhMoyJ4';
    let currentimg=null;
    let data=null;

    document.querySelector('#modal > #close').onclick=()=>{
        modalelement.classList.remove('shown');
        const image=modalelement.querySelector('img');
        modalelement.removeChild(image);
    }
    document.querySelector('#modal > #next').onclick=()=>{
        const oldimage = modalelement.querySelector('img');
        modalelement.removeChild(oldimage);
        currentimg = currentimg.nextSibling;
        const newImage = currentimg.cloneNode();
        modalelement.appendChild(newImage);

    }
    document.querySelector('#modal > #previous').onclick = () =>{
        const oldimage=modalelement.querySelector('img');
        modalelement.removeChild(oldimage);
        currentimg=currentimg.previousSibling;
        const newImage = currentimg.cloneNode();
        modalelement.appendChild(newImage);        

    }
    cameraDropDown.addEventListener('input' ,(e)=>{
        mainelement.innerHTML='';
        fetch(`${imagesurl}${roverDropDown.value}/photos?earth_date=${dateDropDown.value}&camera=${cameraDropDown.value}&api_key=${apikey}`)
            .then(response => response.json())
            .then(json=>{
                console.log(json)
                json.photos.forEach(photo => {
                    mainelement.innerHTML += `<img src= "${photo.img_src}" alt= "${roverDropDown.value.toUpperCase()}'s photo of Mars taken at ${dateDropDown.value} by ${photo.camera.full_name}">`;
                });
                const images = document.querySelectorAll('body > main > img');
                    for(let image of images){
                        image.onclick=(e)=>{
                            //image.requestFullscreen();
                            currentimg=e.target;
                            const copyimage=e.target.cloneNode();
                            modalelement.appendChild(copyimage);
                            modalelement.classList.add('shown');
                            // if(window.innerWidth >= window.innerHeight){
                            //     modalelement.style.height='100%';
                            // } 
                        };
                    }    
            });
    });
        
    dateDropDown.addEventListener ('input',(e)=>{
            mainelement.innerHTML='';

            cameraDropDown.innerHTML='';
            cameraDropDown.setAttribute('disabled', 'true');
            if(dateDropDown.value){
                cameraDropDown.innerHTML='<option values="" selected>Choose Camera</option>';

                data.find(x=> x.date===dateDropDown.value)
                    .cameras
                    .forEach(camera =>{
                    cameraDropDown.innerHTML += `<option values="${camera}">${camera}</option>`;
                });
            cameraDropDown.removeAttribute('disabled');          
            }           
    });
       
    roverDropDown.addEventListener('input' , (e) =>{
        mainelement.innerHTML='';
        dateDropDown.innerHTML='';
        dateDropDown.setAttribute('disabled','true');
        cameraDropDown.innerHTML='';
        cameraDropDown.setAttribute('disabled', 'true');
        if(roverDropDown.value){
            dateDropDown.innerHTML='';
            dateDropDown.setAttribute('disabled','true')

            fetch(`${manifestUrl}${roverDropDown.value}?api_key=${apikey}`)
            .then(response=> response.json())
            .then(json=>{
                console.log(json);

                data= json.photo_manifest.photos.slice(0,50).map(x=> {
                    return{
                        date: x.earth_date,
                        cameras: x.cameras
                    }
                    
                });

                dateDropDown.innerHTML ='<option value="" selected>Choose Date</option>';
                for(let d of data){
                    dateDropDown.innerHTML += `<option value="${d.date}">${d.date}</option>`;
                }
                dateDropDown.removeAttribute('disabled');
            });          
        }
    });

}