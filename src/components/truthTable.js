import React from 'react';
import './css/truthTable.css';
import {TableSquare, SelectionButton} from './buildComponents.js';


export default class TruthTable extends React.Component {
  
    render() {
      const sel = this.props.squares;
      const typeMap = this.props.typeMap;
      const perm = this.props.perm;
      let i = 0;
  
      return (
        <div key={i++}>
          <TableH
            typeMap={typeMap}
            key={i++} />
          <div className="bodyTruthTable" key={i++}>
            <Permutation
              key={i++}
              typeMap={typeMap}
              perm={perm}
            />
            <TableValSelection
              squares={sel}
              typeMap={typeMap}
              perm={perm}
              key={i++}
              onClick={(i, j) => this.props.onClick(i, j)}
              setRowOrColCell={(i, j, k, val) => this.props.setRowOrColCell(i, j, k, val)} />
          </div>
        </div>
      );
    }
  
  }
  
class Permutation extends React.Component { 

    renderTableSquare(val, i) { 
      return (
        <TableSquare
          value={val}
          key={i}
          className="square tableFont"
        />
      );
    }
    renderTableCol2(j, perm) {
      const typeMap = this.props.typeMap;
      
      var html = [];
      let temp = Math.pow(2, typeMap);
  
      for (let i = 0; i < temp; i++) {       
        html.push(this.renderTableSquare(perm[i][j], i));
      }
      return html;
    }
  
    renderTableCol(j, perm) {     
      return (
        <div className="table-col" key={j}>
          {this.renderTableCol2(j, perm) 
          }
        </div>
      );
    }
    renderTablePermutation(perm) {
      const typeMap = this.props.typeMap;
      var html = [];      
  
      for (let j = 0; j < typeMap; j++)   
        html.push(this.renderTableCol(j, perm)); 
  
      return html;
    }
    render() {
      const perm = this.props.perm;
      
      return this.renderTablePermutation(perm);
    }
  }
  
class TableH extends React.Component {    
    renderTableHead(a, i) {
      return (
        <TableSquare value={a} key={i} k={i} className="square tableFont" />
      );
    }
  
    renderTableRow() {
      const typeMap = this.props.typeMap;
      let alphabet = ["A", "B", "C", "D"];
      let a = [];
      let i = 0
      for (; i < typeMap; i++)
        a.push(this.renderTableHead(alphabet[i], i));
      a.push(this.renderTableHead("R", i + 1));
      return a;
  
    }
    render() {
      return <div className="tableHead" key={-1}> {this.renderTableRow()} </div>;
    }
  }
    
class TableValSelection extends React.Component { 
  
    renderSelectionButton(i, j, k) {
      return (
        <SelectionButton
          value={this.props.squares[i][j][0]}
          onClick={() => this.props.onClick(i, j)} 
          key={k}
        />
      );
    }
  
    renderTableCol() { 
      const typeMap = this.props.typeMap;
      let a = [];
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        c = 4;
        r = 2;
      }
      let key = 0;                  
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
          a.push(this.renderSelectionButton(k, l, key++));
        }
      }
      return a;
    }
  
    render() {
      return <div className="table-col-selButton"> {this.renderTableCol()} </div>;
    }
  }  
