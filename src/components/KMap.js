import React from 'react';
import './css/KMap.css';
import './css/drawGroup.css';
import $ from 'jquery';
import Map from './Map.js';
import TruthTable from './truthTable.js';
import OptionButton from './optionButton.js';

export default class KarnaughMap extends React.Component {
    constructor(props) {
      super(props);
  
      let t = 4;
      let a = this.getMatrixSquare(t);
      let p = this.getMatrixPerm(t);
      let m = this.setCoord(a, p, t);
      let s = "SOP";
      this.state = {
        squares: m,   
        typeMap: t,   
        perm: p,      
        typeSol: s    
      };
    }
  
    
    getMatrixPerm(dim) {
      let col = dim;
      let row = Math.pow(2, dim);  
      let a = [];                   
      for (let i = 0; i < row; i++) {   
        let temp = [];
        for (let j = 0; j < col; j++)
          temp[j] = 0;
        a[i] = temp;
      }
  
      for (let j = 0; j < col; j++) {       
        let count = (Math.pow(2, dim)) / 2; 
  
        for (let i = 0; i < row; i++) {     
          let val = (i % (count * 2) < count) ? 0 : 1;  
          a[i][j] = "" + val;                          
        }
        dim--;                        
      }
      return a;
    }
  
    getMatrixSquare(dim) {      
      let row = dim;
      let col = dim;
      let deep = 2;             
                                
      if (dim === 3) {          
        row = 2;
        col = 4;
      }
  
      let a = [];                   
      for (let i = 0; i < row; i++) {
        let temp = [];
        for (let j = 0; j < col; j++) {
          let t = [];
          for (let k = 0; k < deep; k++)
            t[k] = 0;
          temp[j] = t;
        }
        a[i] = temp;
      }
      return a;
    }
  
    setMatrixSquare(val) {                
      const squares = this.state.squares;
      const typeMap = this.state.typeMap;
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        r = 2;
        c = 4;
      }
      for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) {
          squares[i][j][0] = val;
        }
      
      this.reset();
      this.setState({
        squares: squares,
      });
    }
  
    reset(){                              
      const typeMap = this.state.typeMap;
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        r = 2;
        c = 4;
      }
      $("#elabora").prop("disabled", false);  
  
      for (let i = 0; i < r; i++)             
        for (let j = 0; j < c; j++) {
          $("#" + i + j).removeClass();
          $("#" + i + j).html("");
          for (let k = 0; k < 10; k++)
            $("#" + i + j + k).remove();          
        }
      
        $("#sol").html("");                 
        $("#costo").html("");
        $(".Solution").hide();
        $(".Solution").css("left","720px");
    }
  
    setCoord(squares, perm, typeMap) { 
      let r = typeMap;            
      let c = typeMap;            
      
      if (typeMap === 3) {          
        c = 4;
        r = 2;
      }
      for (let i = 0; i < c; i++) {   
        let l;
        if (i === 2) l = 3;          
        else if (i === 3) l = 2;
        else l = i;
  
        for (let j = 0; j < r; j++) { 
          let k;
          if (j % r === 2) k = 3;       
          else if (j % r === 3) k = 2;
          else k = j;
          
          let val = "";
          let t = typeMap;
  
          let p = 0;
          
          do {
            val += perm[i * r + j][p];    
            p++;
          } while (p < t / 2);
          squares[k][l][1] = val;   
          val = "";
          p = Math.floor(t / 2);
          if (typeMap === 3) {        
            t = 2;
            p = Math.floor(t / 2 + 1);
          }
          do {
            val += perm[i * r + j][p];
            p++;
          } while (p < t);
          squares[k][l][2] = val; 
          
        }
      }
      
      return squares;
    }
  
    setTypeMap(val) {                     
      let a = this.getMatrixSquare(val);
      let b = this.getMatrixPerm(val);
      let c = this.setCoord(a, b, val);
      this.reset();
      this.setState({
        typeMap: val,
        squares: c,
        perm: b,
      });
    }
  
    setTypeSol(type){   
      this.reset();
      this.setState({
        typeSol: type
      })
    }
  
    handleClick(i, j) { 
      const squares = this.state.squares; 
      if (squares[i][j][0] === 'X')
        squares[i][j][0] = 0;
  
      else if (squares[i][j][0] === 0)
        squares[i][j][0] = 1;
      else
        squares[i][j][0] = 'X';

      this.reset();
      this.setState({ 
        squares: squares,
      });
    }
  
    
    Algorithm(squares) {
  
      $("#elabora").prop("disabled", true);
      var dimCol, dimRow;
      const typeSol = this.state.typeSol;
      let val = (typeSol === "SOP")? 1 : 0 ;
  
      if (this.state.typeMap === 4) {
        dimCol = 4;
        dimRow = 4;
      }
      else
        if (this.state.typeMap === 3) {
          dimCol = 4;
          dimRow = 2;
        }
        else {
          dimCol = 2;
          dimRow = 2;
        }
  
      var groups = new Array(dimRow); 
  
      for (let i = 0; i < dimRow; i++) {
        groups[i] = new Array(dimCol); 
  
        for (let j = 0; j < dimCol; j++)
          groups[i][j] = []; 
      }
  
      var index = 0; 
      for (let i = 0; i < dimRow; i++) {
        for (let j = 0; j < dimCol; j++) {
  
          var count = 0; 
  
          if (squares[i][j][0] === val) { 
            
            var TempI = i;
            var TempJ = j;
  
            if (j === dimCol - 1)
            {
              let ok = true;
              let count2 = 0;
  
              for (let height = i; height < dimRow && ok; height++)
                if (squares[height][dimCol - 1][0] === val && squares[height][0][0] === val) {
                  groups[height][0].push(index);
                  groups[height][dimCol - 1].push(index);
                  count2++;
                }
                else
                  ok = false;
  
              if (count2 > 0) {
                index++;
  
                if (!isPower(2, count2)) {
                  groups[i + count2 - 1][0].pop();
                  groups[i + count2 - 1][dimCol - 1].pop();
                } 
              }
  
            }
  
            if (i === dimRow - 1)
            {
              let ok = true;
              let count2 = 0;
  
              for (let column = j; column < dimCol && ok; column++)
                if (squares[dimRow - 1][column][0] === val && squares[0][column][0] === val) {
                  groups[dimRow - 1][column].push(index);
                  groups[0][column].push(index);
                  count2++;
                }
                else
                  ok = false;
  
              if (count2 > 0) {
                index++;
  
                if (!isPower(2, count2)) {
                  groups[dimRow - 1][j + count2 - 1].pop();
                  groups[0][j + count2 - 1].pop();
                }
              }
  
            }
  
            do { 
              groups[TempI][TempJ].push(index); 
              count++;
              TempJ++;
            } while (TempJ < dimCol && squares[TempI][TempJ][0] === val);
            
  
            if (!isPower(2, count)) 
            {
              groups[TempI][TempJ - 1].pop(); 
              count--;
            }
  
            var CountVer;
            var depth = 100; 
            var isOk = true; 
            for (let x = 0; x < count; x++) { 
              TempI = i + 1;
              TempJ = j + x;
              CountVer = 1;
  
              while (TempI < dimRow && CountVer < depth) {
                if (squares[TempI][TempJ][0] !== val) {
                  if (x !== 0 && CountVer !== depth) { 
  
                    var Row = TempI;
                    if (!isPower(2, x))
                    {
                      
                      
  
                      if (!isPower(2, CountVer)) 
                        Row--;
  
                      groups[TempI][TempJ].push(index); 
  
                      if (TempI >= depth) 
                        depth = TempI;
                      else
                        depth--;
  
                      for (; Row <= depth; Row++)
                        for (let col = TempJ - 1; col <= x; col++)
                          groups[Row][col].pop();
  
                      isOk = false; 
                    }
                  }
                  break;
                }
                groups[TempI][TempJ].push(index);
                TempI++;
                CountVer++;
              }
  
              if (CountVer < depth)
                depth = CountVer;
  
              if (!isPower(2, CountVer) && isOk) { 
                groups[TempI - 1][TempJ].pop();
                depth--;
              }
            }
            index++;
          }
        }
  
      }
      console.log("Algorithm:");
      console.log(groups);
      this.GroupUp(squares, $.extend(true, [], groups));
    }
  
    GroupUp(squares, values) {
      var groups = [];
  
      var group1 = [];
      var group2 = [];
      var obj1, obj2;
      var dimCol, dimRow;
      const typeSol = this.state.typeSol;
      let val = (typeSol === "SOP")? 1 : 0 ;
  
      if (this.state.typeMap === 4) {
        dimCol = 4;
        dimRow = 4;
      }
      else
        if (this.state.typeMap === 3) {
          dimCol = 4;
          dimRow = 2;
        }
        else {
          dimCol = 2;
          dimRow = 2;
        }
  
      if(squares[0][0][0]===val && squares[0][dimCol-1][0]===val && squares[dimRow-1][0][0]===val && squares[dimRow-1][dimCol-1][0]===val)
      {
  
        obj1 = {
          row: 0,
          col: 0
        };
  
        group1.push(obj1);
        
        obj1 = {
          row: 0,
          col: dimCol-1
        };
  
        group1.push(obj1);
        
        obj1 = {
          row: dimRow-1,
          col: 0
        };
  
        group1.push(obj1);
  
        obj1 = {
          row: dimRow-1,
          col: dimCol-1
        };
  
        group1.push(obj1);
  
        groups.push(group1);
  
        group1=[];
       
      }
  
      for (let i = 0; i < dimRow; i++) {
        for (let j = 0; j < dimCol; j++) {
  
          if (squares[i][j][0] === val) { 
  
            var index = values[i][j][0];
            var startrow = i;
            var startCol = j;
  
            if (j === dimCol - 1) {
              while (startrow < dimRow && values[startrow][j][0] === index && values[startrow][0][0] === index) {
  
                obj1 = {
                  row: startrow,
                  col: 0
                };
  
                obj2 = {
                  row: startrow,
                  col: j
                };
  
                values[startrow][j].shift();
                values[startrow][0].shift();
  
                group1.push(obj1);
                group1.push(obj2);
  
                startrow++;
              }
  
              if (group1.length > 0) {
                groups.push(group1);
                group1 = [];
                index = values[i][j][0];
              }
  
  
              startrow = i;
              startCol = j;
  
            }
  
            if (i === dimRow - 1) {
              while (startCol < dimCol && values[i][startCol][0] === index && values[0][startCol][0] === index) {
  
                obj1 = {
                  row: i,
                  col: startCol
                };
  
                obj2 = {
                  row: 0,
                  col: startCol
                };
  
                values[0][startCol].shift();
                values[i][startCol].shift();
  
                group1.push(obj1);
                group1.push(obj2);
  
                startCol++;
              }
  
              if (group1.length > 0) {
                group1.sort(function (a, b) { return a.row - b.row }); 
                groups.push(group1);
                group1 = [];
                index = values[i][j][0];
              }
  
  
              startrow = i;
              startCol = j;
            }
  
            while (startCol < dimCol && values[startrow][startCol][0] === index)
              startCol++;
  
            while (startrow < dimRow && values[startrow][startCol - 1][0] === index)
              startrow++;
  
  
            for (let Endrow = i; Endrow < startrow; Endrow++)
              for (let EndCol = j; EndCol < startCol; EndCol++) {
                obj1 = {
                  row: Endrow,
                  col: EndCol
                };
                group1.push(obj1);
              }
  
            groups.push(group1);
  
            startrow = i;
            startCol = j;
  
            while (startrow < dimRow && values[startrow][startCol][0] === index)
              startrow++;
  
            while (startCol < dimCol && values[startrow - 1][startCol][0] === index)
              startCol++;
  
            for (let Endrow = i; Endrow < startrow; Endrow++)
              for (let EndCol = j; EndCol < startCol; EndCol++) {
                obj1 = {
                  row: Endrow,
                  col: EndCol
                };
                group2.push(obj1);
              }
  
            var equal = true;
            if (group1.length === group2.length)
            {
              for (let v = 0; v < group1.length && equal; v++)
                if (group1[v].row !== group2[v].row && group1[v].col !== group2[v].col)
                  equal = false;
            }
                  else
                  groups.push(group2);
  
            if (!equal)
             groups.push(group2);
  
            group1 = [];
            group2 = [];
  
            for (let k = 0; k < dimRow; k++)
              for (let z = 0; z < dimCol; z++)
                if (values[k][z][0] === index)
                  values[k][z].shift();
  
          }
  
        }
      }
      console.log("GroupUp:");
      console.log(groups);
      this.CleanAlgorithm($.extend(true, [], groups));
    }
    
    CleanAlgorithm(groups) {
      groups.sort(function (a, b) { return a.length - b.length }); 
      groups.reverse(); 
  
      console.log("CleanAlgorithm:");
      console.log(groups);
  
       var temp = $.extend(true, [], groups); 
       
       for(let i=0; i<temp.length; i++){              
        for(let j=i+1; j<temp.length; j++){           
  
          if(temp[i].length<temp[j].length){          
            let p=i;                                  
            while(temp[p].length<temp[p+1].length){   
              let t = temp[p];                        
              temp[p]=temp[p+1];                      
              temp[p+1]=t;
  
              t = groups[p];                          
              groups[p]=groups[p+1];
              groups[p+1]=t;
            }
          }
  
          for(let k=0; k<temp[i].length; k++){          
            for(let l=0; l<temp[j].length; l++)         
              if((temp[i][k].row===temp[j][l].row) && (temp[i][k].col===temp[j][l].col)){     
                for(let p=l;p<temp[j].length-1;p++) temp[j][p] = temp[j][p+1];                  
                delete temp[j][temp[j].length-1];        
                temp[j].length--;                       
              }     
          }   
        }
      }
  
        var found,deleted,obj1,value;
    for (let v = 0; v < groups.length; v++) 
    {
        deleted = true;
      if (temp[v].length>0)
        for (let index = 0; index < groups[v].length && deleted; index++) 
        {
          obj1 = groups[v][index];
          found = false;
          for (let k = 0; k < groups.length && !found; k++)
          {
  
            if (v !== k && temp[k].length>0) 
            {
              value = groups[k].findIndex((obj2) => obj1.row === obj2.row && obj1.col === obj2.col); 
              if (value !== -1) 
                found = true;
            }
          }
  
            if(found===false)
             deleted=false;
        }
  
        if(deleted===true)
         temp[v]=[];
  
      }
      console.log(temp);
      this.Solution(temp, groups);
      this.drawGroup(temp, groups);
    }
  
    Solution(temp, groups) {                         
      const matrice = this.state.squares;           
      var alp = ["A", "B", "C", "D"];               
      var soln="";                              
      var vettoreSol=[];                              
      var k, j, t;
      
      var elementoR, elementoC;                    
      var flag;                                    
      var coord;                                  
      var ner;
      var tipoSol=this.state.typeSol;
      for (let i = 0; i < temp.length; i++) {
  
        if (temp[i].length > 0) {
          k = 0;
          elementoR = groups[i][0].row;              
          elementoC = groups[i][0].col;
  
          ner = 0;
          while (ner < groups[i].length && groups[i][ner].row === elementoR)  
          {
            ner++;
          }
  
          
          t = 0;
          coord = matrice[elementoR][elementoC][1];  
          while (t < coord.length) {
            j = 1;
            flag = true;
            while (j < groups[i].length && groups[i][j].row === elementoR) {       
              if (coord.charAt(t) !== matrice[elementoR][groups[i][j].col][1].charAt(t)) {  
                flag = false;                                               
                break;
              }
              j++;
            }
            if (flag) {                        
              if(tipoSol==="SOP")                
              {
                if (coord.charAt(t) === "0") {
                  soln += "'" + alp[k];
                }
                else{
                  soln += alp[k];
                }
              }
              else{                               
                if (coord.charAt(t) === "0") {
                  soln += alp[k];
                }
                else{
                  soln += "'" + alp[k];
                }
                soln += "+";
              }
            }
            k++;
            t++;
          }
  
          
          t = 0;
          coord = matrice[elementoR][elementoC][2];    
          while (t < coord.length) {
            j = ner;
            flag = true;
            while (j < groups[i].length && groups[i][j].col === elementoC) {   
              if (coord.charAt(t) !== matrice[groups[i][j].row][elementoC][2].charAt(t)) { 
                flag = false;                                     
                break;
              }
              j += ner;
            }
            if (flag) {                        
              if(tipoSol==="SOP")                 
              {
                if (coord.charAt(t) === "0") {
                  soln +=  "'" + alp[k];
                }
                else{
                  soln += alp[k];
                }
              }
              else{                               
                if (coord.charAt(t) === "0") {
                  soln += alp[k];
                }
                else{
                  soln += "'" + alp[k];
                }
                soln += "+";
              }
            }
            k++;
            t++;
          }
          if(tipoSol==="POS")     
          {
            soln=soln.substr(0,soln.length-1);
          }
          vettoreSol.push(soln);
          soln="";
        }
      }
  
      if (vettoreSol[0] === "" || !vettoreSol[0])   
      {
        
        if (matrice[0][0][0] === 0) {
          vettoreSol[0]="0";
        }
        else {
          vettoreSol[0]="1";
        }
      }
      this.drawSolution(vettoreSol);
    }
  
    drawGroup(temp, groups) {
      let color = ["red", "blue", "green", "orange", "#50C878","lightblue","#CD7F32","#ff6699"];  
      let c = -1; 
      for (let i = 0; i < temp.length; i++) { 
        if (temp[i].length > 0 && groups[i].length !== Math.pow(2, this.state.typeMap)) {
          c++;
          let j = 0;
          let FirstElCol = groups[i][0].col;
          let FirstElRow = groups[i][0].row;
          while (j < groups[i].length) {                                    
            let element = $("#" + groups[i][j].row + groups[i][j].col);    

            if (element.attr('class') && $("#" + element.attr('id') + c)) { 
              element.after("<div id=" + element.attr('id') + c + "></div>"); 
              element = $("#" + groups[i][j].row + groups[i][j].col + c);    
            }
            
            element.css("border-color", color[c]);                            
            element.append("<div class='backgr' style='background-color: "+color[c]+"'></div>"); 

            
            let right = this.checkElInGroups(j, groups[i], "right");
            let bottom = this.checkElInGroups(j, groups[i], "bottom");
            let left = this.checkElInGroups(j, groups[i], "left");
            let top = this.checkElInGroups(j, groups[i], "top");
  
          
            
          
            if (right) {
              if (bottom) {
                if (left) {
                  if (groups[i][j].col === FirstElCol) element.addClass("TopLeft");
                  else if (j === ((groups[i].length / 2) - 1) || j === (groups[i].length - 1)) element.addClass("TopRow");
                  else element.addClass("top")
                }
                else if (top) {
                  if (j === groups[i].length - 2 || j === groups[i].length - 1) element.addClass("BotLeft");
                  else if (groups[i][j].row === FirstElRow) element.addClass("TopLeft");
                  else element.addClass("left");
                }
                else  element.addClass("TopLeft");
              }
              else if (top) {
                if (left) {
                  if (groups[i][j].col === FirstElCol) element.addClass("BotLeft");
                  else if (j === groups[i].length - 1 || j === (groups[i].length/2) - 1) element.addClass("BotRow");
                  else element.addClass("bot");
                }
                else element.addClass("BotLeft");
              }
              else if (left) {
                if (j === 0) element.addClass("ClosedLeft")
                else if (j === groups[i].length - 1) element.addClass("ClosedRow");
                else element.addClass("top-bot");
              }
              else element.addClass("ClosedLeft");
            }
  
            else if (top) {
              if (left) {
                if (bottom) {
                  if (groups[i][j].row === FirstElRow) element.addClass("TopRow");
                  else if (j === groups[i].length - 1 || j === groups[i].length - 2) element.addClass("BotRow");
                  else element.addClass("Rowht");
                }
                else element.addClass("BotRow");
              }
              else if (bottom) {
                if (j === 0) element.addClass("ClosedTop");
                else if (j === groups[i].length - 1) element.addClass("ClosedBot");
                else element.addClass("left-Rowht");
              }
              else element.addClass("ClosedBot");
            }
  
            else if (left) {
              if (bottom) element.addClass("TopRow");
              else element.addClass("ClosedRow");
            }
            else if (bottom) element.addClass("ClosedTop");
            else element.addClass("monoGroup");
            j++;
          }
        }
      }
    }
  
    checkElInGroups(j, groups, lato) { 
      const matrix = this.state.squares;
      let r = matrix[0].length;
      let c = matrix[0].length;
      if (this.state.typeMap === 3) {
        r = 2;
        c = 4;
      }
      
      for (let k = 0; k < groups.length; k++) {
        if (lato === "right" && (groups[k].col === (groups[j].col + 1) % c && groups[k].row === groups[j].row % r))
          return true;
        if (lato === "bottom" && (groups[k].col === groups[j].col % c && groups[k].row === (groups[j].row + 1) % r))
          return true;
        if (lato === "left") {
          let col = groups[j].col - 1;
          if (col < 0) col = c - 1;
          if ((groups[k].col === col % c && groups[k].row === groups[j].row % r))
            return true;
        }
        if (lato === "top") {
          let row = groups[j].row - 1;
          if (row < 0) row = r - 1;
          if ((groups[k].col === groups[j].col % c && groups[k].row === row % r))
            return true;
        }
      }
      return false;
    }
  
    drawSolution(vettoreSol){   
      $(".Solution").show();
  
      let costo=0; 
      if(vettoreSol[0]==="0" || vettoreSol[0]==="1"){ 
        $("#sol").append("<div>"+ vettoreSol[0]+ "</div>");
      }
      else{
        const typeSol = this.state.typeSol;
        let s = (typeSol==="SOP")? "+":"·";   
        let cls = (typeSol==="SOP")? "groupSop":"groupPos"; 

        
        let color = ["red", "blue", "green", "orange", "#50C878","lightblue","#CD7F32","#ff6699"];  
  
        for(let i=0; i<vettoreSol.length; i++){ 
          
          $("#sol").append("<div id='sol"+i+"' class='"+cls+"' style='background-color: "+color[i]+"'></div>");
          
          for(let j=0; j<vettoreSol[i].length; j++){ 

            if(vettoreSol[i][j]!=="'")
              $("#sol"+i).append(vettoreSol[i][j]+" "); 
            else{
              
              $("#sol"+i).append("<span style='text-decoration: overline'>"+vettoreSol[i][++j]+"</span> ");
            }
            if(vettoreSol[i][j]!=="+") costo++; 
          }
          if(i!==vettoreSol.length-1) $("#sol").append("<div class='plus'> "+s+" </div>"); 
        }
      }
      $("#costo").html("Literal Cost: "+costo); 

      
      $(".Solution").css("left", parseInt($(".Solution").css("left"))-parseInt($(".Solution").css("width"))/2);
    }
  
    render() {
      
      const values = this.state.squares;
      const typeMap = this.state.typeMap;
      const perm = this.state.perm;
      const typeSol = this.state.typeSol;
      
      let i = 0; 
      return (
        <div key={i++}>
            <div className="title"><h1> Karnaugh Map Solver </h1></div>
          <div className="bodyPage" key={i++}>
            <p className="nameTab"> Truth Table </p>
            <div className="truthTable" key={i++}>
              <TruthTable
                squares={values}
                typeMap={typeMap}
                perm={perm}
                key={i++}
                onClick={(i, j) => this.handleClick(i, j)}
                setRowOrColCell={(i, j, k, val) => this.setRowOrColCell(i, j, k, val)}
              />
            </div>
            <div className="kMap">
              <Map
                squares={values}
                typeMap={typeMap}
                onClick={(i, j) => this.handleClick(i, j)}
              />
            </div>
  
            <OptionButton
              squares={values}
              typeMap={typeMap}
              typeSol={typeSol}
              onClick={() => this.Algorithm(values)}
              setTypeSol={(val) => this.setTypeSol(val)}
              setMatrixSquare={(val) => this.setMatrixSquare(val)}
              setTypeMap={(val) => this.setTypeMap(val)}
            />
            <div className="Solution">
              <div>{typeSol} form:</div>
              <div className="sol" id="sol">  
              </div>
              <div id="costo"> 
                </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  function isPower(x, y) {
    if (x === 1)
      return (y === 1);
  
    var pow = 1;
    while (pow < y)
      pow *= x;
  
    return (pow === y);
  }
