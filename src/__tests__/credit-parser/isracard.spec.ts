import { expect, test } from "bun:test";
import parseIsracard from "../../credit-parser/isracard";

const expectedCharges = [
  {
    date: "03/08/2023",
    business: "עסק קרדיט",
    dealAmount: 18.54,
    currency: "₪",
    chargeAmount: 18.54,
    misc: "קרדיט",
  },
  {
    date: "28/06/2023",
    business: "עסק א'",
    dealAmount: 869,
    currency: "₪",
    chargeAmount: 434.5,
    misc: "תשלום 2  מתוך 2",
  },
  {
    date: "09/07/2023",
    business: "עסק ב'",
    dealAmount: 279,
    currency: "₪",
    chargeAmount: 279,
  },
  {
    date: "12/07/2023",
    business: "עסק ג'",
    dealAmount: 46.76,
    currency: "₪",
    chargeAmount: 46.76,
  },
  {
    date: "17/08/2022",
    business: "עסק א'",
    dealAmount: 9613.5,
    currency: "₪",
    chargeAmount: 801,
    misc: "תשלום 12 מתוך 12",
  },
];

test("should not include total amount row", async () => {
  const res = await parseIsracard(
    `${import.meta.dir}/__fixtures__/isra-fixture.xlsx`
  );
  console.log(res);
  expect(res.find((row) => row.business === `סך חיוב בש"ח:`)).toBeNil();
});

test("should extract all charges correctly", async () => {
  const res = await parseIsracard(
    `${import.meta.dir}/__fixtures__/isra-fixture.xlsx`
  );
  console.log(res);
  expect(res).toEqual(expectedCharges);
});
