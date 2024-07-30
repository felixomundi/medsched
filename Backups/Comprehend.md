To develop the MedSched Healthcare Appointment System, you'll need to create various models to represent different entities and their interactions within the system. Here’s a comprehensive list of the models you would typically require:

1. **User Model:**
   - Represents all users of the system including patients, healthcare providers, and administrative staff.

   ```json
   {
     "id": "string",
     "username": "string",
     "password": "string",
     "email": "string",
     "role": "string",  // "patient", "provider", "admin"
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

2. **Patient Model:**
   - Specific information about patients.

   ```json
   {
     "id": "string",
     "user_id": "string",  // Reference to the User model
     "first_name": "string",
     "last_name": "string",
     "dob": "date",
     "medical_history": "string",
     "contact_number": "string",
     "address": {
       "street": "string",
       "city": "string",
       "state": "string",
       "zip_code": "string"
     },
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

3. **Provider Model:**
   - Information about healthcare providers.

   ```json
   {
     "id": "string",
     "user_id": "string",  // Reference to the User model
     "first_name": "string",
     "last_name": "string",
     "specialty": "string",
     "contact_number": "string",
     "schedule": "array",  // Array of available slots
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

4. **Appointment Model:**
   - Represents an appointment between a patient and a healthcare provider.

   ```json
   {
     "id": "string",
     "patient_id": "string",  // Reference to the Patient model
     "provider_id": "string",  // Reference to the Provider model
     "appointment_type": "string",  // General check-up, follow-up, specialist referral, etc.
     "status": "string",  // Scheduled, Completed, Cancelled
     "appointment_date": "datetime",
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

5. **Reminder Model:**
   - Represents reminders sent to patients about their appointments.

   ```json
   {
     "id": "string",
     "appointment_id": "string",  // Reference to the Appointment model
     "patient_id": "string",  // Reference to the Patient model
     "reminder_date": "datetime",
     "reminder_type": "string",  // Email, SMS, On-screen
     "status": "string",  // Pending, Sent, Failed
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

6. **MedicalRecord Model:**
   - Represents a patient's medical records.

   ```json
   {
     "id": "string",
     "patient_id": "string",  // Reference to the Patient model
     "record_type": "string",  // Type of record (e.g., prescription, lab result)
     "record_data": "string",  // Actual data (encrypted)
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

7. **ScheduleSlot Model:**
   - Represents the available time slots for providers.

   ```json
   {
     "id": "string",
     "provider_id": "string",  // Reference to the Provider model
     "start_time": "datetime",
     "end_time": "datetime",
     "is_available": "boolean",
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

8. **Notification Model:**
   - Represents notifications sent within the system (e.g., new appointment booked, appointment canceled).

   ```json
   {
     "id": "string",
     "user_id": "string",  // Reference to the User model
     "notification_type": "string",  // e.g., appointment booked, reminder sent
     "message": "string",
     "is_read": "boolean",
     "created_at": "datetime",
     "updated_at": "datetime"
   }
   ```

9. **AuditLog Model:**
   - Records all important actions within the system for auditing purposes.

   ```json
   {
     "id": "string",
     "action_type": "string",  // e.g., login, logout, appointment_created
     "user_id": "string",  // Reference to the User model
     "timestamp": "datetime",
     "details": "string"
   }
   ```

**Relational Diagram:**

Here’s a simplified relational diagram showing the connections between these models:

- `User` connects to `Patient` and `Provider` via `user_id`.
- `Appointment` connects to `Patient` and `Provider` via `patient_id` and `provider_id`.
- `Reminder` connects to `Appointment` and `Patient` via `appointment_id` and `patient_id`.
- `MedicalRecord` connects to `Patient` via `patient_id`.
- `ScheduleSlot` connects to `Provider` via `provider_id`.
- `Notification` connects to `User` via `user_id`.
- `AuditLog` connects to `User` via `user_id`.

This relational structure ensures that all entities and their interactions are properly managed, providing a robust foundation for the MedSched Healthcare Appointment System.


Sure, here are additional models that could be beneficial for the MedSched Healthcare Appointment System to enhance its functionality and user experience:

10. **Insurance Model:**
    - Represents the insurance information for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "insurance_provider": "string",
      "policy_number": "string",
      "coverage_details": "string",
      "expiry_date": "date",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

11. **Payment Model:**
    - Represents payment information related to appointments.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "patient_id": "string",  // Reference to the Patient model
      "amount": "number",
      "payment_method": "string",  // e.g., credit card, insurance
      "payment_status": "string",  // Paid, Pending, Failed
      "transaction_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

12. **Prescription Model:**
    - Represents prescriptions issued by healthcare providers.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "medication": "string",
      "dosage": "string",
      "instructions": "string",
      "issue_date": "datetime",
      "expiry_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

13. **Feedback Model:**
    - Represents feedback from patients regarding their appointments.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "patient_id": "string",  // Reference to the Patient model
      "rating": "number",  // e.g., 1 to 5 stars
      "comments": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

14. **Specialty Model:**
    - Represents different specialties available within the healthcare system.

    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

15. **Department Model:**
    - Represents different departments within a healthcare facility.

    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

16. **VisitSummary Model:**
    - Represents summaries of patient visits.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "summary": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

17. **Document Model:**
    - Represents documents related to patient care, such as lab results, imaging reports, and referral letters.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "document_type": "string",  // e.g., lab result, imaging report
      "file_path": "string",  // Path to the document file
      "uploaded_at": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

18. **NotificationPreference Model:**
    - Represents the notification preferences of patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "email_notifications": "boolean",
      "sms_notifications": "boolean",
      "push_notifications": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

19. **SystemSettings Model:**
    - Represents configurable settings for the system.

    ```json
    {
      "id": "string",
      "setting_name": "string",
      "setting_value": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

20. **Role Model:**
    - Represents different roles within the system for access control.

    ```json
    {
      "id": "string",
      "role_name": "string",  // e.g., admin, patient, provider
      "permissions": "array",  // List of permissions for the role
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

21. **Permission Model:**
    - Represents specific permissions that can be assigned to roles.

    ```json
    {
      "id": "string",
      "permission_name": "string",
      "description": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

**Extended Relational Diagram:**

- `User` connects to `Patient` and `Provider` via `user_id`.
- `Appointment` connects to `Patient` and `Provider` via `patient_id` and `provider_id`.
- `Reminder` connects to `Appointment` and `Patient` via `appointment_id` and `patient_id`.
- `MedicalRecord`, `Prescription`, `Document`, `VisitSummary`, and `Insurance` connect to `Patient` via `patient_id`.
- `ScheduleSlot` connects to `Provider` via `provider_id`.
- `Notification` and `NotificationPreference` connect to `User` via `user_id`.
- `Payment` connects to `Appointment` and `Patient` via `appointment_id` and `patient_id`.
- `Feedback` connects to `Appointment` and `Patient` via `appointment_id` and `patient_id`.
- `Specialty` and `Department` models are independent but can be linked to `Provider` or `Appointment` if needed.
- `Role` and `Permission` models are used for access control and can be linked to `User`.

These additional models will provide a more comprehensive and functional healthcare appointment system, addressing various aspects of patient care, provider management, and system administration.


Certainly! Here are additional models that can further enhance the MedSched Healthcare Appointment System:

22. **Facility Model:**
    - Represents different healthcare facilities within the system.

    ```json
    {
      "id": "string",
      "name": "string",
      "location": {
        "address": "string",
        "city": "string",
        "state": "string",
        "zip_code": "string"
      },
      "contact_number": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

23. **AppointmentType Model:**
    - Represents different types of appointments available.

    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "default_duration": "number",  // Default duration in minutes
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

24. **ClinicalNote Model:**
    - Represents clinical notes added by providers during or after appointments.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "provider_id": "string",  // Reference to the Provider model
      "note": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

25. **Allergy Model:**
    - Represents allergies recorded for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "allergy_name": "string",
      "reaction": "string",
      "severity": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

26. **LabOrder Model:**
    - Represents lab orders placed by providers for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "order_details": "string",
      "order_date": "datetime",
      "status": "string",  // e.g., ordered, completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

27. **LabResult Model:**
    - Represents results from lab tests.

    ```json
    {
      "id": "string",
      "lab_order_id": "string",  // Reference to the LabOrder model
      "result_details": "string",
      "result_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

28. **Procedure Model:**
    - Represents medical procedures performed or scheduled.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "procedure_name": "string",
      "procedure_date": "datetime",
      "status": "string",  // e.g., scheduled, completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

29. **BillingModel:**
    - Represents billing information for appointments and procedures.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "procedure_id": "string",  // Reference to the Procedure model
      "patient_id": "string",  // Reference to the Patient model
      "amount": "number",
      "billing_date": "datetime",
      "status": "string",  // Paid, Pending, Overdue
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

30. **CarePlan Model:**
    - Represents care plans for patients created by providers.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "care_plan_details": "string",
      "start_date": "datetime",
      "end_date": "datetime",
      "status": "string",  // Active, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

31. **EmergencyContact Model:**
    - Represents emergency contact information for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "name": "string",
      "relationship": "string",
      "contact_number": "string",
      "email": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

32. **Referral Model:**
    - Represents referrals made by providers to specialists or other healthcare facilities.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "referring_provider_id": "string",  // Reference to the Provider model
      "referred_provider_id": "string",  // Reference to the Provider model or facility
      "referral_reason": "string",
      "referral_date": "datetime",
      "status": "string",  // e.g., pending, completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

33. **InventoryModel:**
    - Represents inventory items within the healthcare facility.

    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "supplier": "string",
      "expiry_date": "date",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

34. **Supplier Model:**
    - Represents suppliers providing inventory to healthcare facilities.

    ```json
    {
      "id": "string",
      "name": "string",
      "contact_person": "string",
      "contact_number": "string",
      "email": "string",
      "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "zip_code": "string"
      },
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

35. **AppointmentHistory Model:**
    - Represents the history of changes made to appointments.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "changed_by": "string",  // Reference to the User model
      "change_date": "datetime",
      "change_details": "string",
      "created_at": "datetime"
    }
    ```

36. **CommunicationLog Model:**
    - Represents logs of communications between patients and providers or staff.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "communication_type": "string",  // e.g., phone, email, in-person
      "details": "string",
      "communication_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

37. **TaskModel:**
    - Represents tasks assigned to staff within the healthcare facility.

    ```json
    {
      "id": "string",
      "assigned_to": "string",  // Reference to the User model
      "assigned_by": "string",  // Reference to the User model
      "task_description": "string",
      "due_date": "datetime",
      "status": "string",  // Pending, In Progress, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

38. **EducationResource Model:**
    - Represents educational resources available to patients.

    ```json
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",  // Link to resource
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

These additional models will provide a more comprehensive and functional healthcare appointment system, addressing various aspects of patient care, provider management, inventory, communication, and system administration.

Absolutely, here are even more models that could further enrich the MedSched Healthcare Appointment System:

39. **ImmunizationRecord Model:**
    - Represents immunization records for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "vaccine_name": "string",
      "dose_number": "number",
      "administration_date": "datetime",
      "provider_id": "string",  // Reference to the Provider model
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

40. **TelehealthSession Model:**
    - Represents telehealth sessions conducted between patients and providers.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "session_date": "datetime",
      "session_duration": "number",  // Duration in minutes
      "session_link": "string",  // Link to the telehealth session
      "status": "string",  // Scheduled, Completed, Cancelled
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

41. **HealthGoal Model:**
    - Represents health goals set by patients with their providers.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "goal_description": "string",
      "start_date": "datetime",
      "end_date": "datetime",
      "status": "string",  // Active, Achieved, In Progress
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

42. **EmergencyVisit Model:**
    - Represents emergency visits to the healthcare facility.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "visit_date": "datetime",
      "provider_id": "string",  // Reference to the Provider model
      "visit_reason": "string",
      "treatment_given": "string",
      "follow_up_required": "boolean",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

43. **ReferralFeedback Model:**
    - Represents feedback from the referred provider regarding a patient.

    ```json
    {
      "id": "string",
      "referral_id": "string",  // Reference to the Referral model
      "provider_id": "string",  // Reference to the referring provider
      "feedback": "string",
      "feedback_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

44. **PrescriptionRefillRequest Model:**
    - Represents requests for prescription refills made by patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "prescription_id": "string",  // Reference to the Prescription model
      "request_date": "datetime",
      "status": "string",  // Pending, Approved, Denied
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

45. **ChronicCondition Model:**
    - Represents chronic conditions recorded for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "condition_name": "string",
      "diagnosis_date": "datetime",
      "status": "string",  // Active, Inactive
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

46. **FitnessActivity Model:**
    - Represents fitness activities logged by patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "activity_type": "string",  // e.g., walking, running, yoga
      "duration": "number",  // Duration in minutes
      "calories_burned": "number",
      "activity_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

47. **AppointmentRequest Model:**
    - Represents requests for appointments made by patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "preferred_date": "datetime",
      "preferred_time": "string",  // e.g., morning, afternoon
      "reason": "string",
      "status": "string",  // Pending, Scheduled, Denied
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

48. **MedicalDevice Model:**
    - Represents medical devices assigned to patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "device_name": "string",
      "device_serial_number": "string",
      "assignment_date": "datetime",
      "status": "string",  // Active, Inactive
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

49. **NutritionalPlan Model:**
    - Represents nutritional plans created for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "plan_description": "string",
      "start_date": "datetime",
      "end_date": "datetime",
      "status": "string",  // Active, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

50. **Caregiver Model:**
    - Represents caregivers assigned to patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "caregiver_name": "string",
      "relationship": "string",  // e.g., family member, hired caregiver
      "contact_number": "string",
      "email": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

51. **SymptomTracker Model:**
    - Represents symptoms tracked by patients over time.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "symptom": "string",
      "severity": "string",  // e.g., mild, moderate, severe
      "tracking_date": "datetime",
      "notes": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

52. **DietaryRestriction Model:**
    - Represents dietary restrictions for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "restriction": "string",  // e.g., gluten-free, diabetic
      "notes": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

53. **MentalHealthAssessment Model:**
    - Represents mental health assessments conducted for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "assessment_details": "string",
      "assessment_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

54. **RehabilitationPlan Model:**
    - Represents rehabilitation plans for patients undergoing physical therapy or other forms of rehab.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "plan_details": "string",
      "start_date": "datetime",
      "end_date": "datetime",
      "status": "string",  // Active, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

55. **MedicalAlert Model:**
    - Represents medical alerts for patients, such as allergies or critical conditions.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "alert_type": "string",  // e.g., allergy, chronic condition
      "description": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

56. **PatientSurvey Model:**
    - Represents surveys filled out by patients to provide feedback on their care.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "survey_date": "datetime",
      "survey_questions": [
        {
          "question": "string",
          "answer": "string"
        }
      ],
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

These models further extend the functionality and capability of the MedSched

Certainly! Here are additional models to further expand the MedSched Healthcare Appointment System:

57. **TreatmentPlan Model:**
    - Represents comprehensive treatment plans for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "plan_details": "string",
      "start_date": "datetime",
      "end_date": "datetime",
      "status": "string",  // Active, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

58. **MedicalResearchStudy Model:**
    - Represents patients enrolled in medical research studies.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "study_name": "string",
      "study_description": "string",
      "enrollment_date": "datetime",
      "status": "string",  // Active, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

59. **LabTestOrder Model:**
    - Represents lab tests ordered for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "test_name": "string",
      "order_date": "datetime",
      "status": "string",  // Ordered, Completed, Cancelled
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

60. **LabTestResult Model:**
    - Represents results of lab tests conducted for patients.

    ```json
    {
      "id": "string",
      "lab_test_order_id": "string",  // Reference to the LabTestOrder model
      "result_details": "string",
      "result_date": "datetime",
      "status": "string",  // Normal, Abnormal
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

61. **HomeCareVisit Model:**
    - Represents home care visits scheduled for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "visit_date": "datetime",
      "visit_duration": "number",  // Duration in minutes
      "visit_notes": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

62. **HealthInsurance Model:**
    - Represents health insurance details for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "insurance_provider": "string",
      "policy_number": "string",
      "coverage_details": "string",
      "valid_until": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

63. **MedicalDeviceMonitoring Model:**
    - Represents monitoring data from medical devices used by patients.

    ```json
    {
      "id": "string",
      "device_id": "string",  // Reference to the MedicalDevice model
      "patient_id": "string",  // Reference to the Patient model
      "monitoring_data": {
        "parameter": "string",
        "value": "number",
        "unit": "string",
        "recorded_at": "datetime"
      },
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

64. **PatientFeedback Model:**
    - Represents feedback provided by patients on their experience.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "feedback_date": "datetime",
      "feedback_details": "string",
      "rating": "number",  // e.g., 1 to 5
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

65. **WellnessProgram Model:**
    - Represents wellness programs offered to patients.

    ```json
    {
      "id": "string",
      "program_name": "string",
      "program_description": "string",
      "start_date": "datetime",
      "end_date": "datetime",
      "status": "string",  // Active, Completed
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

66. **PatientCarePlan Model:**
    - Represents overall care plans for patients, encompassing various aspects of their treatment and wellness.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "provider_id": "string",  // Reference to the Provider model
      "care_plan_details": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

67. **PatientHealthScore Model:**
    - Represents a scoring system to assess patients' overall health.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "score": "number",
      "assessment_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

68. **MedicalAlertNotification Model:**
    - Represents notifications sent to patients or caregivers about medical alerts.

    ```json
    {
      "id": "string",
      "alert_id": "string",  // Reference to the MedicalAlert model
      "recipient_id": "string",  // Reference to the Patient or Caregiver model
      "notification_date": "datetime",
      "notification_method": "string",  // e.g., SMS, Email
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

69. **PatientConsent Model:**
    - Represents patient consent for various medical procedures or data sharing.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "consent_type": "string",  // e.g., Treatment, Data Sharing
      "consent_details": "string",
      "consent_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

70. **ProviderSpecialization Model:**
    - Represents specializations of healthcare providers.

    ```json
    {
      "id": "string",
      "provider_id": "string",  // Reference to the Provider model
      "specialization": "string",
      "certification_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

71. **PatientEmergencyContact Model:**
    - Represents emergency contact details for patients.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "contact_name": "string",
      "relationship": "string",  // e.g., Family Member, Friend
      "contact_number": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

72. **PatientHealthProfile Model:**
    - Represents a detailed health profile for patients, including medical history and lifestyle information.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "medical_history": "string",
      "lifestyle_details": "string",
      "allergies": "string",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

73. **CareTeam Model:**
    - Represents a team of healthcare providers assigned to a patient.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "team_members": [
        {
          "provider_id": "string",  // Reference to the Provider model
          "role": "string"  // e.g., Primary Care Physician, Specialist
        }
      ],
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

74. **AppointmentCancellation Model:**
    - Represents records of appointment cancellations and their reasons.

    ```json
    {
      "id": "string",
      "appointment_id": "string",  // Reference to the Appointment model
      "cancellation_reason": "string",
      "cancelled_by": "string",  // Patient or Provider
      "cancellation_date": "datetime",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

75. **PatientReferralHistory Model:**
    - Represents the history of referrals made for a patient.

    ```json
    {
      "id": "string",
      "patient_id": "string",  // Reference to the Patient model
      "referrals": [
        {
          "referral_id": "string",  // Reference to the Referral model
          "referral_date": "datetime",
          "referral_status": "string"  // Pending, Completed, Cancelled
        }
      ],
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ```
These models provide a more comprehensive view of patient care, ensuring that every aspect of the patient’s healthcare journey is meticulously recorded and managed.