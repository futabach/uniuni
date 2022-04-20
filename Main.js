// OS���ʗp
string jsData;
let os;

// DOM�\�z�����C�x���g�n���h���o�^
window.addEventListener("DOMContentLoaded", init);

// ������
function init() {
	jsData="";
    // �ȈՓI��OS����
    os = detectOSSimply();
    if (os == "iphone") {
        // safari�p�BDeviceOrientation API�̎g�p�����[�U�ɋ����ĖႤ
        document.querySelector("#permit").addEventListener("click", permitDeviceOrientationForSafari);

        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else{
        window.alert("PC���Ή��T���v��");
    }
}


// �W���C���X�R�[�v�ƒn���C���Z���T�[����擾
function orientation(event) {
    let absolute = event.absolute;
    let alpha = event.alpha;
    let beta = event.beta;
    let gamma = event.gamma;

    let degrees;
    if(os == "iphone") {
        // webkitCompasssHeading�l���̗p
        degrees = event.webkitCompassHeading;

    }else{
        // deviceorientationabsolute�C�x���g��alpha��␳
        degrees = compassHeading(alpha, beta, gamma);
    }

    let direction;
    if (
        (degrees > 337.5 && degrees < 360) ||
        (degrees > 0 && degrees < 22.5)
    ) {
        direction = "�k";
    } else if (degrees > 22.5 && degrees < 67.5) {
        direction = "�k��";
    } else if (degrees > 67.5 && degrees < 112.5) {
        direction = "��";
    } else if (degrees > 112.5 && degrees < 157.5) {
        direction = "����";
    } else if (degrees > 157.5 && degrees < 202.5) {
        direction = "��";
    } else if (degrees > 202.5 && degrees < 247.5) {
        direction = "�쐼";
    } else if (degrees > 247.5 && degrees < 292.5) {
        direction = "��";
    } else if (degrees > 292.5 && degrees < 337.5) {
        direction = "�k��";
    }

    document.querySelector("#direction").innerHTML =
        direction + " : " + degrees;
    document.querySelector("#absolute").innerHTML = absolute;
    document.querySelector("#alpha").innerHTML = alpha;
    document.querySelector("#beta").innerHTML = beta;
    document.querySelector("#gamma").innerHTML = gamma;
    jsData = direction + "," + degrees  + "," + absolute + "," + alpha + "," + beta + "," + gamma;
}

// �[���̌X���␳�iAndroid�p�j
// https://www.w3.org/TR/orientation-event/
function compassHeading(alpha, beta, gamma) {
    var degtorad = Math.PI / 180; // Degree-to-Radian conversion

    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    var Vx = -cZ * sY - sZ * sX * cY;
    var Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    var compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}

// �Ȉ�OS����
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13��safari�̓f�t�H���g�uMacintosh�v�Ȃ̂ŕʓr�v�Ή�
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}

// iPhone + Safari�̏ꍇ��DeviceOrientation API�̎g�p�������[�U�ɋ��߂�
function permitDeviceOrientationForSafari() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === "granted") {
                window.addEventListener(
                    "deviceorientation",
                    detectDirection
                );
            }
        })
        .catch(console.error);
}
