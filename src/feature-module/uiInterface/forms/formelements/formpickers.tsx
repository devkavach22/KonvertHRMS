
import type { DatePickerProps } from 'antd';
import { DatePicker, TimePicker } from 'antd';

import { ColorPicker } from 'antd';



const { RangePicker } = DatePicker;


const FormPikers = () => {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
 

    return (
        <div className="page-wrapper cardhead">
          
        </div>

    )
}

export default FormPikers
