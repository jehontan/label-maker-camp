import React from 'react';
import qrcode from 'qrcode-generator';
import DateFnsAdapter from "@date-io/date-fns";

const dateFns = new DateFnsAdapter();

class Label extends React.Component {
  
  render() {

    if (this.props.person) {
      const canvas = this.props.canvasRef.current;
      const ctx = canvas.getContext("2d");
      const p = this.props.person;

      // Cat Status
      ctx.save();
      ctx.font = "60px Arial";
      ctx.translate(400,0);
      ctx.rotate(-Math.PI/2);
      ctx.textAlign = "center";
      ctx.fillText("CAT 2A", -180, 0);
      ctx.restore();

      // Field labels
      ctx.font = "30px Arial";
      ctx.fillText("Name:", 500, 60);
      ctx.fillText("NRIC/FIN:", 500, 120)
      ctx.fillText("Bed:", 500, 180);
      ctx.fillText("Admission:", 500, 240);
      ctx.fillText("Drug Allergy:", 500, 300);

      // Field data
      ctx.font = "30px Arial";
      ctx.fillText(p.name, 750, 60);
      ctx.fillText(p.nric, 750, 120)
      ctx.fillText(p.bed_no, 750, 180);
      ctx.fillText(dateFns.format(p.admission_date, "dd MMM yyyy"), 750, 240);
      ctx.fillText(p.allergies, 750, 300);

      // QR Code
      const qr = qrcode(0,'H');
      qr.addData(p.nric);
      qr.make();
      ctx.save();
      ctx.translate(50,50);
      qr.renderTo2dContext(ctx, 10);
      ctx.restore();
    }

    const divStyle={
      overflow: 'scroll',
      width:'100%',
      float: 'left',
      position:'relative'
    };

    return (
      <div style={divStyle}>
        <canvas ref={this.props.canvasRef} 
                id="labelCanvas"
                width={this.props.dpmm*this.props.labelWidth}
                height={this.props.dpmm*this.props.labelHeight} />
      </div>
    )
  }
}

export default Label