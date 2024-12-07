// Hitokoto

async function fetchHitokoto() {
    try {
        const response = await fetch('https://v1.hitokoto.cn');
        const data = await response.json();
        
        const hitokoto = document.querySelector('#hitokoto_text');
        hitokoto.href = `https://hitokoto.cn/?uuid=${data.uuid}`;
        hitokoto.innerText = data.hitokoto;
        
    } catch (error) {
        console.error(error);
    }
}

fetchHitokoto();
