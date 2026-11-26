import Catalog from "./_components/catalog/Catalog";
import PreloaderGate from "./_components/preloader/PreloaderGate";

export default function Home() {
  return (
    <PreloaderGate>
      <Catalog />
    </PreloaderGate>
  );
}
