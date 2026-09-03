
export default function VariantSelector({ variants, selectedVariant, onSelect }) {
  const storageOptions = [...new Set(variants.map((v) => v.storage))];
  const colorOptions = [];
  const seenColors = new Set();

  for (const v of variants) {
    if (!seenColors.has(v.color)) {
      seenColors.add(v.color);
      colorOptions.push(v);
    }
  }
  function findBestMatch(storage, color) {
    return (
      variants.find((v) => v.storage === storage && v.color === color) ||
      variants.find((v) => v.storage === storage) ||
      variants.find((v) => v.color === color) ||
      variants[0]
    );
  }

  function handleStorageClick(storage) {
    onSelect(findBestMatch(storage, selectedVariant.color));
  }

  function handleColorClick(color) {
    const matchingVariant = variants.find(
      (v) => v.storage === selectedVariant.storage && v.color === color
    );

    if (matchingVariant) {
      onSelect(matchingVariant);
    }
  }

  return (
    <div className="variant-selector">
      {storageOptions.length > 1 && (
        <div className="variant-group">
          <p className="variant-label">Storage</p>

          <div className="variant-options">
            {storageOptions.map((storage) => {
              const isSelected = selectedVariant.storage === storage;

              return (
                <button
                  key={storage}
                  onClick={() => handleStorageClick(storage)}
                  className={
                    isSelected
                      ? "storage-button selected"
                      : "storage-button"
                  }
                >
                  {storage}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colorOptions.length > 1 && (
        <div className="variant-group">
          <p className="variant-label">
            Color:{" "}
            <span className="variant-label-value">
              {selectedVariant.color}
            </span>
          </p>

          <div className="variant-options">
            {colorOptions.map((variant) => {
              const isSelected = selectedVariant.color === variant.color;
              const isAvailable = variants.some(
                (v) =>
                  v.storage === selectedVariant.storage &&
                  v.color === variant.color
              );

              return (
                <button
                  key={variant.color}
                  title={isAvailable ? variant.color : "Unavailable"}
                  disabled={!isAvailable}
                  onClick={() => handleColorClick(variant.color)}
                  className={
                    isSelected
                      ? "color-dot selected"
                      : "color-dot"
                  }
                >
                  <span
                    className="color-dot-swatch"
                    style={{ backgroundColor: variant.colorHex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

