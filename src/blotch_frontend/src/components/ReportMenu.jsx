import React from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '../../../../node_modules/@mui/material/index';
  
export default class ReportMenu extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{borderRadius: '15px', display: 'flex', alignItem: 'center', justifyContent: 'center', width: '30vw', backgroundColor: 'rgba(142, 142, 150, .9)', padding: '5%'}}>
                <FormControl fullWidth onSubmit={() => {this.props.submit()}}>
                    <InputLabel id="reportInputLabel">Reason</InputLabel>
                    <Select
                        labelId="reportReason"
                        id="reportReason"
                        label="Reason"
                        onChange={() => {}}
                    >
                        <MenuItem value="Sexual content">Sexual content</MenuItem>
                        <MenuItem value="Violent or repulsive content">Violent or repulsive content</MenuItem>
                        <MenuItem value="Hateful or abusive content">Hateful or abusive content</MenuItem>
                        <MenuItem value="Harassment or bullying">Harassment or bullying</MenuItem>
                        <MenuItem value="Harmful or dangerous acts">Harmful or dangerous acts</MenuItem>
                        <MenuItem value="Child abuse">Child abuse</MenuItem>
                        <MenuItem value="Promotes terrorism">Promotes terrorism</MenuItem>
                        <MenuItem value="Spam or misleading">Spam or misleading</MenuItem>
                        <MenuItem value="Infringes my rights">Infringes my rights</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    <div style={{height: '30px'}}></div>
                    <TextField style={{}} multiline={true} rows={3} id="reportInformation" label="More Information" variant="standard" />
                    <Button variant="text" onClick={() => {this.props.cancel()}}>Cancel</Button>
                    <Button variant="text" onClick={() => {this.props.submit()}}>Submit</Button>
                </FormControl>
            </div>
        );
    }
}
