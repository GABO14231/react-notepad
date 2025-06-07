import {useState, useCallback, memo} from "react";

export const TagDropdown = memo(({availableTags, selectedTags, onChange}) =>
{
    const [open, setOpen] = useState(false);
    const toggleDropdown = useCallback(() => {setOpen((prev) => !prev);}, []);
    const handleToggleOption = useCallback((tag) =>
    {
        const isSelected = selectedTags.some((t) => t.id === tag.id && t.type === tag.type);
        if (isSelected) onChange(selectedTags.filter((t) => t.id !== tag.id || t.type !== tag.type));
        else onChange([...selectedTags, tag]);
    }, [onChange, selectedTags]);

    return (
        <div className="tag-dropdown" tabIndex={0} role="button" onClick={toggleDropdown}
            onKeyDown={(e) => {if (e.key === "Enter") toggleDropdown();}}>
            <div className="dropdown-header">
                {selectedTags.length === 0 ? "Select tags": selectedTags.filter(tag => tag && tag.name)
                    .map(tag => tag.name).join(", ")}
                <span className="dropdown-arrow">▼</span>
            </div>
            {open && (
                <div className="dropdown-options" onClick={(e) => e.stopPropagation()}>
                    {availableTags.map((tag) =>
                    (
                        <label key={tag.key} className="dropdown-option">
                            <input type="checkbox"
                                checked={selectedTags.some((t) => t.id === tag.id && t.type === tag.type)}
                                onChange={() => handleToggleOption(tag)}/>{" "} {tag.name}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
});