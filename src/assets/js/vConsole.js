import Vconsole from 'vconsole'
let vConsole = '';
setTimeout(() => {
    let num = 1;
    let flag = true;
    document.querySelector('#app').onclick = () => {
        if (flag) {
            console.log(num);
            num++;
            let oldNum = num;
            setTimeout(() => {
                if (oldNum == num) {
                    num = 1;
                }
            }, 500);
            if (num == 25) {
                vConsole = new Vconsole();
                flag = false;
            }
        }

    }
}, 1000);
export default vConsole
