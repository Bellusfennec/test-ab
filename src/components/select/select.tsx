import React, { useState, useRef, useEffect } from "react";
import { useOutsideClick } from "../../hooks";
import { SvgIcon } from "../svg-icon";
import styles from "./select.module.css";

type SelectProps<T> = {
  items: T[];
  loadMoreItems: () => void;
  hasMore: boolean;
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => React.Key;
  placeholder?: string;
  getIconLabel?: (item: T) => string;
};

export const Select = <T,>(props: SelectProps<T>) => {
  const { items, loadMoreItems, hasMore, renderItem, getKey, placeholder = "Select item", getIconLabel } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight <= Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight);

    if (bottom && hasMore) loadMoreItems();
  };

  const renderIcon = (item: T) => {
    if (getIconLabel) {
      const label = getIconLabel(item);
      return <div className={styles.icon}>{label.charAt(0)}</div>;
    }
    return null;
  };

  useOutsideClick(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      dropdownRef.current.classList.add(styles.open);
      setTimeout(() => {
        if (selectedItemRef.current) {
          selectedItemRef.current.scrollIntoView({ block: "center" });
        }
      }, 300);
    } else if (dropdownRef.current) {
      dropdownRef.current.classList.remove(styles.open);
    }
  }, [isOpen]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.select + (isOpen ? ` ${styles.active}` : "")} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.text} title={selectedItem ? renderItem(selectedItem)?.toString() : placeholder}>
          {selectedItem ? renderItem(selectedItem) : placeholder}
        </div>
        <SvgIcon name="arrow" width={9} height={9} />
      </div>
      <div className={styles.dropdown} ref={dropdownRef} onScroll={handleScroll}>
        {items.map((item) => (
          <div
            key={getKey(item)}
            ref={selectedItem === item ? selectedItemRef : null}
            className={styles.item + (selectedItem === item ? ` ${styles.selected}` : "")}
            onClick={() => {
              setSelectedItem(item);
              setIsOpen(false);
            }}
            title={renderItem(item)?.toString()}
          >
            {renderIcon(item)}
            <div className={styles.text}>{renderItem(item)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
