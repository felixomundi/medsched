import * as Yup from 'yup';
export const createAppointmentTypeSchema = Yup.object().shape({
name: Yup.string().required('Required'),
        description: Yup.string(),
        duration: Yup.number().required('Required').positive('Duration must be positive').integer('Duration must be an integer'),
        cost: Yup.number().required('Required').positive('Cost must be positive'),
    
})