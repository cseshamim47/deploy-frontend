import React from 'react'
import Title from '../ui/Title';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { title } from 'process';

const contents = [
  {
    title: "Is fuel included in the tariff?",
    description:
      "All prices are exclusive of fuel. We provide a minimal amount of fuel to get the vehicle to the nearest fuel station. In case there is excess fuel in the vehicle at the time of return, Gobikes is not liable for any refunds for the same.",
  },
  {
    title:
      "Can the bike booked be delivered to my home/office? If yes, then what are the charges?",
    description:
      "Delivery depends on many factors. You can call us on +91-8448444897 and check if the delivery is possible or not.",
  },
  {
    title: "How can I book a bike without seeing it physically?",
    description:
      "We offer a 100% money back guarantee. Pay a commitment advance to reserve the bike. Reach location and test drive your bike. If there is any issue in the vehicle, raise a ticket and you shall be refunded 100% of the amount you have paid us. No questions asked in case there is mechanical fault in the Vehicle.",
  },
  {
    title: "I have a Learner's Licence. Will that work?",
    description:
      "We don't give bikes/scooters on learner's licence. You need to have a driver's licence.",
  },
  {
    title: "Can I cancel my booking? If yes then how?",
    description:
      "Yes. You can cancel your booking by going to the Bookings sections in the Profile tab. Upon booking a bike with any of our dealers, they reserve the bike for the customer. In the case of cancellation, unnecessary inconvenience is caused to the dealer. To account for the potential financial loss, we withhold some amount as cancellation charges as follows: No Show/After Pickup-time - 100% deduction. In case of partial payment - 100% deduction. In case of full payment: Before 72 hrs of the pickup time - 25% deduction. Between 24-72 hrs of the pickup time - 75% deduction. Between 0-24 hrs of the pickup time - 100% deduction",
  },
  {
    title: "How does Gobikes handle security deposits?",
    description:
      "Security Deposits with Gobikes are kept secure and are 100% refundable to the rider after he/she has completed their bike trip and have returned the bike.",
  },
  {
    title: "Will I be getting a complimentary helmet?",
    description:
      "Gobikes provides one complimentary helmet with each bike booked. A second helmet can also be provided but it is chargeable at INR 50 per day.",
  },
];

const Faq = () => {
  return (
    <div className="grid md:grid-cols-2">
      <div className="hidden md:block"></div>
      <div className="space-y-8">
        <Title
          title="Have Questions? We got you."
          description="Contact us on +91-8448444897 WhatsApp/Call in case of any other query."
          showText={true}
        />
        <Accordion type="single" collapsible>
          {contents.map((content, index) => (
            <AccordionItem value={`item-${index+1}`} key={index}>
              <AccordionTrigger className='text-base'>{content.title}</AccordionTrigger>
              <AccordionContent className='text-base'>
                {content.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Faq