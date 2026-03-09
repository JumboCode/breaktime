import BookingPage from "./mobile/BookingPageMobile";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";

export default function TestPage() {
  return (
    // Testing!!
    <div>
      <BookingPage service={ {name:"Shower", imageImport: ShowerCarouselImage}}/>
    </div>
  );
}