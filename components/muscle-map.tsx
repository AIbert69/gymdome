import Image from "next/image";

/**
 * Anatomical muscle-focus diagram (front + back views, highlighted muscles).
 * The source PNG has a "MUSCLE FOCUS" label baked into the top ~14% — we hide
 * that band with a container that clips it (the card supplies its own header).
 */
export function MuscleMap() {
  return (
    <div className="relative h-[210px] w-[145px] flex-shrink-0 overflow-hidden">
      <Image
        src="/muscle-focus.png"
        alt="Front and back muscle group highlights"
        width={264}
        height={396}
        priority
        className="absolute left-1/2 h-auto w-[175px] -translate-x-1/2"
        style={{ top: "-32px" }}
      />
    </div>
  );
}
