import React from 'react';
import qrcode from 'qrcode-generator';
import DateFnsAdapter from "@date-io/date-fns";

const dateFns = new DateFnsAdapter();

class Label extends React.Component {
  render() {

    if (this.props.generate) {
      const canvas = this.props.canvasRef.current;
      const ctx = canvas.getContext("2d");
      const p = this.props;

      const printLeftMargin = this.props.printer.dpmm*this.props.printer.marginLeft;
      const printHeight = this.props.printer.dpmm*(this.props.printer.labelHeight-2*this.props.printer.marginTop);
      // const printWidth = this.props.printer.dpmm*(this.props.printer.labelWidth-this.props.printer.marginLeft);
      const printPadding = 50;
      const textSize = 30;
      const textLineSpace = 20;
      const textBlockHeight = 4*textSize + 4*textLineSpace;
      const qrScale = 10;

      // QR Code
      ctx.save()
      ctx.scale(this.props.printer.scale, this.props.printer.scale);

      ctx.save();
      ctx.translate(printLeftMargin, 0);
      const qr = qrcode(0,'H');
      qr.addData(p.nric);
      qr.make();
      const qrWidth = qr.getModuleCount()*qrScale;
      ctx.translate(printPadding, (printHeight-qrWidth)/2);
      qr.renderTo2dContext(ctx, qrScale);
      ctx.restore();

      ctx.save();
      ctx.translate(printLeftMargin+printPadding+qrWidth+50, (printHeight-textBlockHeight)/2);

      // Field labels
      ctx.font = "bold " + textSize + "px Arial";
      ctx.fillText("Name:", 0, 0);
      ctx.fillText("NRIC/FIN:", 0, (textSize+textLineSpace))
      ctx.fillText("Date of Birth:", 0, 3*(textSize+textLineSpace));
      ctx.fillText("Bed Assignment:", 0, 2*(textSize+textLineSpace));
      ctx.fillText("Drug Allergy:", 0, 4*(textSize+textLineSpace));

      // Field data
      ctx.translate(300, 0);
      ctx.font = "bold "+ textSize +"px Arial";
      ctx.fillText(p.name, 0, 0);
      ctx.fillText(p.nric, 0, (textSize+textLineSpace))
      ctx.fillText(dateFns.format(p.dob, "dd MMM yyyy"), 0, 3*(textSize+textLineSpace));
      ctx.fillText(`${p.bed_sector}/${p.bed_tent}/${p.bed_no}`, 0, 2*(textSize+textLineSpace));
      ctx.fillText(p.allergies, 0, 4*(textSize+textLineSpace));

      ctx.restore();
      ctx.restore();
    }

    return (
      <div style={{
        overflow: 'scroll',
        width:'100%',
        float: 'left',
        position:'relative'
      }}>
        <div style={{
          width:this.props.printer.dpmm*(this.props.printer.labelWidth),
          height:this.props.printer.dpmm*(this.props.printer.labelHeight),
          display: "flex",
          justifyContent: 'left',
          alignItems: 'center',
          border: "solid 1px black"
        }}>
          <canvas ref={this.props.canvasRef}
                  style={{border: "dashed 1px black"}}
                  id="labelCanvas"
                  width={this.props.printer.dpmm*(this.props.printer.labelWidth-this.props.printer.marginLeft)*this.props.printer.scale}
                  height={this.props.printer.dpmm*(this.props.printer.labelHeight-2*this.props.printer.marginTop)*this.props.printer.scale}
          />
        </div>
      </div>
    )
  }
}

export default Label