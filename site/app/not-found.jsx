import { copy } from "../lib/content";
import { Icon } from "../components/Icons";
import { Button } from "../components/Shell";
export default function NotFound() {
  return (
    <main id="main" className="dn-not-found dn-container">
      <div aria-hidden="true">
        4<Icon name="spark" />4
      </div>
      <h1>{copy.misc.notFound}</h1>
      <p>{copy.misc.notFoundText}</p>
      <Button href="/">{copy.labels.back}</Button>
    </main>
  );
}
