import * as Yup from 'yup';

export const createFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too short')
    .max(250, 'Too long')
    .required('Required'),
  description: Yup.string()
    .min(2, 'Too short')
    .max(3000, 'Too long')
    .required('Required'),
  acceptanceCriteria: Yup.string()
    .min(2, 'Too short')
    .max(3000, 'Too long')
    .required('Required'),
  contactInformation: Yup.string().min(1, 'Too short').max(250, 'Too long'),
  bounty: Yup.number().min(50, 'Amount too low').required('Required'),
  labels: Yup.array().of(
    Yup.object().shape({ id: Yup.number(), name: Yup.string() })
  ),
  identity: Yup.array().of(
    Yup.object().shape({ id: Yup.number(), name: Yup.string() })
  ),
  acceptanceTests: Yup.array().of(
    Yup.object().shape({ id: Yup.number(), name: Yup.string() })
  ),
  requiredDeposit: Yup.number().min(50, 'Amount too low').required('Required'),
  endDate: Yup.date()
    .min(new Date(), 'Date cannot be in the past')
    .required('Required'),
});
