import {FormLayout, TextField, Button} from '@shopify/polaris';
import { useState } from 'react';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useActionData, useSubmit , Form } from '@remix-run/react';


export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();

  const dynamicTitle = formData.get("discountTitle");
  const dynamicCode = formData.get("discountCode");

  console.log("dicountTitle" . dynamicTitle)
  console.log("discountCode" , dynamicCode)

  const response = await admin.graphql(
    `#graphql
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 10) {
              nodes {
                code
              }
            }
            startsAt
            endsAt
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
              }
              items {
                ... on AllDiscountItems {
                  allItems
                }
              }
            }
            appliesOncePerCustomer
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
    {
      variables: {
        basicCodeDiscount: {
          title: dynamicTitle,
          code: dynamicCode,
          startsAt: "2022-06-21T00:00:00Z",
          endsAt: "2022-09-21T00:00:00Z",
          customerSelection: {
            all: true,
          },
          customerGets: {
            value: {
              percentage: 0.2,
            },
            items: {
              all: true,
            },
          },
          appliesOncePerCustomer: true,
        },
      },
    },
  );

  const data = await response.json();

  return json({discount: data})
}

const Discount = () => {

  const [discontTitle, setDiscountTitle] = useState("");
  const [dicountCode, setDiscountCode] = useState("")
  const actionData = useActionData()
  console.log(actionData)
  const submit = useSubmit()

  const handleSubmit = ()=> submit({}, {replace: true , method: "post"})


  return (
    <Form onSubmit={handleSubmit} method='post'>
      <FormLayout>
        <TextField
          value={discontTitle}
          onChange={(value)=>setDiscountTitle(value)}
          label="Discount Title"
          type="text"
          name="discountTitle"
          id="discounttitle"
          autoComplete="off"
        />
         <TextField
          value={dicountCode}
          onChange={(value)=>setDiscountCode(value)}
          label="Discount Code"
          type="text"
          name="discountCode"
          id="discountcode"
          autoComplete="off"
        />

        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
  );
};

export default Discount