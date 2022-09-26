import chai, {expect} from "chai"
import * as pureimage from "../src/index.js"
import fs from "fs"
import path from "path"
const DIR = "output"
const mkdir = (pth) => {
    return new Promise((res,rej)=>{
        fs.mkdir(pth,(e)=>{
            // console.log("done with mkdir",e)
            res()
        })
    })
}
mkdir(DIR)
describe('draw curve',() => {

    let image;
    let c;
    const WHITE = 0xFFFFFFFF
    const BLACK = 0x000000FF

    beforeEach(() => {
        image = pureimage.make(200,200)
        c = image.getContext('2d')
        c.fillStyle = 'white'
        c.fillRect(0,0,200,200)
    })

    it('canvas is empty and clear', (done) => {
        expect(image.getPixelRGBA(0,0)).to.eq(WHITE)
        done()
    })

    it('making a square with lines', (done) => {
        c.beginPath()
        c.moveTo(10,10)
        c.lineTo(100,10)
        c.lineTo(100,100)
        c.lineTo(10,100)
        c.lineTo(10,10)
        c.fillStyle = 'black'
        c.fill()
        expect(image.getPixelRGBA(0,0)).to.eq(WHITE)
        expect(image.getPixelRGBA(11,11)).to.eq(BLACK)
        expect(image.getPixelRGBA(50,50)).to.eq(BLACK)
        expect(image.getPixelRGBA(100,100)).to.eq(WHITE)
        done()
    })

    it('making a square with rect', (done) => {
        c.beginPath()
        c.rect(10,10,90,90)
        c.fillStyle = 'black'
        c.fill()
        expect(image.getPixelRGBA(0,0)).to.eq(WHITE)
        expect(image.getPixelRGBA(11,11)).to.eq(BLACK)
        expect(image.getPixelRGBA(50,50)).to.eq(BLACK)
        expect(image.getPixelRGBA(100,100)).to.eq(WHITE)
        done()
    })

    //draw bezier curve
    it('bezier curve', (done) => {
        c.fillStyle = 'white'
        c.fillRect(0,0,200,200)

        c.fillStyle = 'black'
        c.beginPath()
        c.moveTo(10,10)
        c.bezierCurveTo(50,50, 100,50, 10,100)
        c.lineTo(10,10)
        c.fill()
        pureimage.encodePNGToStream(image, fs.createWriteStream(path.join(DIR,'bezier1.png'))).then(() => {
            console.log('wrote out bezier1.png')
            expect(image.getPixelRGBA(0, 0)).to.eq(WHITE)
            expect(image.getPixelRGBA(19, 39)).to.eq(BLACK)
            done()
        })

        // expect(image.getPixelRGBA(0,0)).to.eq(WHITE)
        // expect(image.getPixelRGBA(20,15)).to.eq(BLACK)
        // done()
    })

    it('arc', (done) => {
        // should look the same as
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc

        let img = pureimage.make(200, 200);
        let ctx = img.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = "black";

        // Draw shapes
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 2; j++) {
                ctx.beginPath();
                let x             = 25 + j * 50;                 // x coordinate
                let y             = 25 + i * 50;                 // y coordinate
                let radius        = 20;                          // Arc radius
                let startAngle    = 0;                           // Starting point on circle
                let endAngle      = Math.PI + (Math.PI * j) / 2; // End point on circle
                let anticlockwise = i % 2 === 1;                  // Draw anticlockwise


                if (i > 1) {
                    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
                    ctx.fill();
                } else {
                    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
                    ctx.stroke();
                }
            }
        }
        pureimage.encodePNGToStream(img, fs.createWriteStream(path.join(DIR,'arc.png'))).then(()=>{
            console.log('wrote out arc.png')
            done()
        })
    })
    it('north going polygon', (done) => {
        let img = pureimage.make(200, 200);
        let ctx = img.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = "black";
        ctx.moveTo(100,100)
        ctx.lineTo(100,120)
        ctx.lineTo(20,120)
        ctx.lineTo(20,50)
        ctx.fill();
        pureimage.encodePNGToStream(img, fs.createWriteStream(path.join(DIR,'northgoing.png'))).then(()=>{
            console.log('wrote out northgoing.png')
            expect(img.getPixelRGBA(25, 110)).to.eq(BLACK)
            expect(img.getPixelRGBA(25, 90)).to.eq(BLACK)
            done()
        })

    })
    it('transparent polygon',(done)=>{
        c.beginPath()
        c.moveTo(10,10)
        c.lineTo(100,10)
        c.lineTo(100,100)
        c.lineTo(10,100)
        c.lineTo(10,10)
        c.fillStyle = 'transparent'
        c.fill()
        expect(image.getPixelRGBA(0,0)).to.eq(WHITE)
        expect(image.getPixelRGBA(11,11)).to.eq(WHITE)
        expect(image.getPixelRGBA(50,50)).to.eq(WHITE)
        expect(image.getPixelRGBA(100,100)).to.eq(WHITE)



        done()
    })
    it("draws thick square",(done) => {
        c.fillStyle = 'white'
        c.fillRect(0,0,200,200)
        c.beginPath()
        //square
        c.moveTo(10,10)
        c.lineTo(60,10)
        c.lineTo(60,60)
        c.lineTo(120,60)
        c.lineTo(120,10)
        c.lineTo(180,10)
        c.lineTo(180,100)
        c.lineTo(10,100)
        // c.lineTo(10,10)
        c.strokeStyle = 'black'
        c.lineWidth = 4
        c.fillStyle = 'black'
        c.stroke()
        // c.fillStyle = 'black'
        // c.fill()
        pureimage.encodePNGToStream(image, fs.createWriteStream(path.join(DIR,'thick_stroke_square.png'))).then(() => {
            console.log('wrote out thick_stroke.png')
            // expect(image.getPixelRGBA(0, 0)).to.eq(WHITE)
            // expect(image.getPixelRGBA(19, 39)).to.eq(BLACK)
            done()
        })
    })
    it('draws a thin horizontal line',(done) => {
        let fname = "thin-h-stroke.png"
        let image = pureimage.make(10, 10);
        let c = image.getContext('2d');
        c.imageSmoothingEnabled = true
        c.fillStyle = 'white'
        c.fillRect(0,0,10,10)
        // c.debug = true
        c.beginPath()
        c.moveTo(2,5)
        c.lineTo(8,5)
        c.strokeStyle = 'black'
        c.lineWidth = 1
        c.stroke()
        pureimage.encodePNGToStream(image, fs.createWriteStream(path.join(DIR,fname))).then(() => {
            console.log(`wrote out "${fname}"`)
            // expect(image.getPixelRGBA(0, 0)).to.eq(WHITE)
            // expect(image.getPixelRGBA(19, 39)).to.eq(BLACK)
            done()
        })

    })
    it("draws thick curve",(done) => {
        c.fillStyle = 'white'
        c.fillRect(0,0,200,200)

        c.beginPath()
        c.moveTo(10,10)
        c.bezierCurveTo(50,50, 100,50, 10,100)
        c.lineTo(10,10)
        c.strokeStyle = 'black'
        c.lineWidth = 2
        c.fillStyle = 'black'
        c.stroke()
        // c.fillStyle = 'black'
        // c.fill()
        pureimage.encodePNGToStream(image, fs.createWriteStream(path.join(DIR,'thick_stroke_curve.png'))).then(() => {
            console.log('wrote out thick_stroke.png')
            // expect(image.getPixelRGBA(0, 0)).to.eq(WHITE)
            // expect(image.getPixelRGBA(19, 39)).to.eq(BLACK)
            done()
        })
    })

    it('draws round rect',(done) => {
        create();

        let img = create();
        pureimage.encodePNGToStream(img, fs.createWriteStream(path.join(DIR,'roundrect.png'))).then(() => {
            console.log('wrote out roundrect.png')
            done()
        }).catch((e)=>{
            console.log("there was an error writing");
            console.log(e);
        });

        function create() {
            let img = pureimage.make(1200, 628)
            let ctx = img.getContext('2d')
            let WIDTH = 1200
            let HEIGHT = 628

            ctx.imageSmoothingEnabled = true;

            // clear background
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            // background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // top color box
            ctx.fillStyle = '#142C6E';
            ctx.fillRect(0, 0, 338, HEIGHT / 2);

            // bottom color box
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(0, HEIGHT / 2, 338, HEIGHT / 2);

            // Green rectangle box
            ctx.fillStyle = '#00FF00';
            roundRect(ctx, 44, 239, 250, 150, 8);


            function roundRect(ctx, x, y, width, height, radius) {
                console.log("drawing a round rect");
                if (typeof radius === 'undefined') {
                    radius = 5;
                }
                if (typeof radius === 'number') {
                    radius = {tl: radius, tr: radius, br: radius, bl: radius};
                } else {
                    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
                    for (var side in defaultRadius) {
                        radius[side] = radius[side] || defaultRadius[side];
                    }
                }
                ctx.beginPath();
                ctx.moveTo(x + radius.tl, y);
                ctx.lineTo(x + width - radius.tr, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
                ctx.lineTo(x + width, y + height - radius.br);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
                ctx.lineTo(x + radius.bl, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
                ctx.lineTo(x, y + radius.tl);
                ctx.quadraticCurveTo(x, y, x + radius.tl, y);
                ctx.lineTo(x + radius.tl, y);
                ctx.closePath();
                // ctx.fill_aa();
                ctx.fill()
            }
            return img
        }
    })
})
describe('restroke test',() => {
    it('draws multiple lines',(done) => {
        let image = pureimage.make(200,200)
        let ctx = image.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,200,200)
        ctx.beginPath() // Only needed in pureimage :/

// First sub-path
        ctx.lineWidth = 26;
        ctx.strokeStyle = 'rgba(255,165,0,0.5)'
        ctx.moveTo(20, 20);
        ctx.lineTo(160, 20);
        ctx.stroke();

// Second sub-path
        ctx.lineWidth = 14;
        ctx.strokeStyle = 'rgba(0,255,0,0.5)'
        ctx.moveTo(20, 80);
        ctx.lineTo(220, 80);
        ctx.stroke();

// // Third sub-path
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255,192,203,0.5)'
        ctx.moveTo(20, 140);
        ctx.lineTo(280, 140);
        ctx.stroke();

        pureimage.encodePNGToStream(image, fs.createWriteStream(path.join(DIR,'restroke.png'))).then(() => {
            console.log('wrote out restroke.png')
            done()
        })
    })
})
