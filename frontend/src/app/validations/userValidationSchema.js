import * as Yup from "yup";

export const updateUserValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    role: Yup.string().required("Role is required"),
    dob: Yup.date().nullable().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipcode: Yup.string().required("Zipcode is required"),
    newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .test('is-valid', 'Password is required', function(value) {
      const { confirmPassword } = this.parent;
      return !(confirmPassword && !value) || (value && value.length >= 8);
    }),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .test('is-valid', 'Confirm password is required', function(value) {
      const { newPassword } = this.parent;
      return !(newPassword && !value) || (value && value === newPassword);
    }),
});
