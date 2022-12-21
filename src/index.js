const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
global._babelPolyfill = false

import {Chart,registerables} from './chartDist/chart'
import {
  intlMapGen
} from './intlMap.js';
Chart.register(...registerables)

class Charts {
    constructor (runtime){
        this.runtime = runtime;
        this.runtime.registerPeripheralExtension('Charts', this);
    }
    
    getInfo (){
      const intlMap = intlMapGen()
        return {
            id: 'chart',
            name: 'Chart',
            color1: '#EC5D77',
            color2: '#AF3249',
            blocks: [{
              opcode: 'openChart',
              blockType: BlockType.COMMAND,
              text: intlMap.openChart,
            },
            {
              opcode: 'setChartType',
              blockType: BlockType.COMMAND,
              text: intlMap.setChartType,
              arguments:{
                TYPE: {
                  type: ArgumentType.STRING,
                  defaultValue: 'bar',
                  menu: "chartType"
                }
              }
            },
            {
              opcode: 'setChartTitle',
              blockType: BlockType.COMMAND,
              text: intlMap.setChartTitle,
              arguments:{
                TITLE: {
                  type: ArgumentType.STRING,
                  defaultValue: '图表标题',
                }
              }
            },
            {
              opcode: 'setAxis',  //设置坐标轴
              blockType: BlockType.COMMAND,
              text: intlMap.setAxis,
              arguments:{
                X: {
                  type: ArgumentType.STRING,
                  defaultValue: '时间/h:m',
                },
                Y: {
                  type: ArgumentType.STRING,
                  defaultValue: '湿度/%',
                }
              }
            },
            {
              opcode: 'addData',
              blockType: BlockType.COMMAND,
              text: intlMap.addData,
              arguments:{
                DATA: {
                  type: ArgumentType.STRING,
                  defaultValue: '数据名称',
                },
                X: {
                  type: ArgumentType.STRING,
                  defaultValue: 'x轴数值',
                },
                Y: {
                  type: ArgumentType.STRING,
                  defaultValue: 'y轴数值',
                }
              }
            },
            {
              opcode: 'clearChart',
              blockType: BlockType.COMMAND,
              text: intlMap.clearChart,
            },
            {
              opcode: 'closeChart',
              blockType: BlockType.COMMAND,
              text: intlMap.closeChart,
            },
            {
              opcode: 'reload',
              blockType: BlockType.COMMAND,
              text: '刷新',
            },
          ],
            menus: {
              chartType:['bar','line','doughnut','pie','radar','scatter']
            },
        };
    }

    reload(){
      location.reload()
    }

    colors = [
      {bk:'#F7D6DD',bd:'#E88299'},
      {bk:'#F7D8B8',bd:'#EEB070'},
      {bk:'#F8DFA2',bd:'#F2C654'},
      {bk:'#B0D8D8',bd:'#6CB7B7'},
      {bk:'#C3D9F6',bd:'#80B2EC'},
      {bk:'#E0D6FE',bd:'#A184FC'},
      {bk:'#DCDDDF',bd:'#C2C4C8'},
    ]

    listenMouse = null
    colorNum = 0
    downX = 0
    downY = 0
    sDown = false
    type = 'bar'
    title = '11'
    chartData = {
      labels: ['10:00','11:00','12:00'],  //x轴数据
      datasets: [{
        label: '室外温度',  //代表数据的对象
        data: [10,11,12],  //y轴数据
        borderWidth: 2  //边框宽度
      },{
        label: '室内温度',  //代表数据的对象
        data: [5,7,5],  //y轴数据
        borderWidth: 2  //边框宽度
      }]
    }
    options = {
      scales: {
        x: {
          title: {
            display: true,
            text: '时间'
          }
        },
        y: {
          title: {
            display: true,
            text: '摄氏度'
          },
          beginAtZero: true  //y轴从0开始
        }
      }
    }
    openChart(){
      const mouseDown = ()=>{
        let disX = window.event.clientX
        let disY= window.event.clientY
        this.downX = disX
        this.downY = disY
        this.isDown = true
      }

      const mouseUp = ()=>{
        this.downX = 0
        this.downY = 0
        this.isDown = false
      }

      const chartPosition = `
      <div id="chartPosition">
        <div id="enlargeChart"></div>
        <div id="closeChart"></div>
        <div id="chartHeader"></div>
        <div id="chartBody">
          <div id="chartTitle"></div>
          <canvas id="newCon"></canvas>
        </div>
      </div>
      `
      const fragment = document.createRange().createContextualFragment(chartPosition)
      let Body = document.getElementById('content')
      Body.appendChild(fragment)

      let chartHeader = document.getElementById('chartHeader')
      let chartBody = document.getElementById('chartBody')
      let closeChart = document.getElementById('closeChart')
      let chartWin = document.getElementById('chartPosition')
      const newCon = document.getElementById('newCon')
      let enlargeChart = document.getElementById('enlargeChart')
      let chartTitle = document.getElementById('chartTitle')
      
      chartTitle.innerText = this.title

      closeChart.onclick=()=>{
        //停止监听鼠标
        window.removeEventListener('mousemove',listenMouse,false)
        Body.removeChild(chartWin)
      }

      chartWin.style = `
      width: 800px; height: 460px; background: #FFFFFF; position: absolute; z-index: 40; left: 400px; top: 100px; box-shadow: -2px -2px 3px rgba(0, 0, 0, 0.25), 4px 4px 6px rgba(0, 0, 0, 0.6);border-radius: 10px;
      `
      chartBody.style = `
      overflow-y: auto;position: relative;width: 790px; height: 400px;
      `
      chartHeader.style = `
      width: 800px; height: 30px; margin-bottom: 10px;background: #3D3D3D;border-radius: 10px 10px 0px 0px;
      `
      closeChart.style = `
        position: absolute; 
        right: 15px; 
        top: 9px; 
        cursor: pointer;
        user-select: none;
        background: #F46464;
        border-radius: 6px;
        width: 12px;
        height: 12px
      `
      enlargeChart.style = `
      position: absolute; right: 35px; top: 9px; cursor: pointer;user-select: none;background: #98CC6F;border-radius: 6px;width: 12px;height: 12px;
      `

      const hoverStyle = (dom,commonColor,hoverColor) => {  //设置hover效果
        dom.onmouseenter = () => {
          dom.style.background = hoverColor
        }
        dom.onmouseleave = () => {
          dom.style.background = commonColor
        }
      }

      hoverStyle(closeChart,'#F46464','#AF3249')
      hoverStyle(enlargeChart,'#98CC6F','#569921')

      
      new Chart(newCon, {
        type: this.type,
        data: this.chartData,
        options: this.options
      });
      const listenMouse = ()=>{  //监听鼠标
        window.addEventListener('mousedown',(a)=>{
          if(a.path[0].id==='chartHeader') mouseDown(a.clientX,a.clientY)
        })
        window.addEventListener('mouseup',()=>{
          mouseUp()
        })
        if(this.isDown){
          let deltaX = window.event.clientX - this.downX
          let deltaY = window.event.clientY - this.downY
          this.downX = window.event.clientX
          this.downY = window.event.clientY
          let newOffsetLeft = chartWin.offsetLeft + deltaX
          let newOffsetTop = chartWin.offsetTop + deltaY

          chartWin.style.left = newOffsetLeft + "px"
          chartWin.style.top = newOffsetTop + "px"
        }
      }
      window.addEventListener('mousemove',listenMouse)

      this.listenMouse = listenMouse
    }

    updateChart(){
      const newCon1 = document.getElementById('newCon')
      const chartBody = document.getElementById('chartBody')
      chartBody.removeChild(newCon1)
      const fragment = document.createRange().createContextualFragment('<canvas id="newCon"></canvas>')
      chartBody.appendChild(fragment)
      const newCon2 = document.getElementById('newCon')
      new Chart(newCon2, {
        type: this.type,  //图表类型-柱状图
        data: this.chartData,
        options: this.options
      });
    }

    setChartType(args){
      this.type = args.TYPE
      this.updateChart()
    }
    setChartTitle(args){
      let chartTitle = document.getElementById('chartTitle')
      this.title = args.TITLE
      chartTitle.innerText = this.title
    }
    setAxis(args){
      this.options.scales.x.title.text = args.X
      this.options.scales.y.title.text = args.Y
      this.updateChart()
    }
    addData(args){
      if(!this.chartData.labels.includes(args.X)){
        this.chartData.labels.push(args.X)
      }
      const xIndex = this.chartData.labels.indexOf(args.X)
      const labelArr = Array.from(this.chartData.datasets,({label})=>label)
      if(!labelArr.includes(args.DATA)){
        this.chartData.datasets.push({
          label: args.DATA,
          data: [],
          backgroundColor: this.colors[this.colorNum].bk,
          borderColor: this.colors[this.colorNum].bd,
          borderWidth: 2
        })
        this.colorNum++
      }
      const index = labelArr.indexOf(args.DATA)
        this.chartData.datasets[index].data[xIndex] = args.Y
      this.updateChart()
    }
    clearChart(){
      this.chartData.datasets[0].data = []
      this.updateChart()
    }
    closeChart(){
      if(this.listenMouse){
        let Body = document.getElementById('content')
        let chartWin = document.getElementById('chartPosition')
        window.removeEventListener('mousemove',this.listenMouse,false)
        Body.removeChild(chartWin)
        this.listenMouse = null
      }
    }
}

module.exports = Charts;