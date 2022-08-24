interface iconProps {
  iconName: string         // icon 图标名
  customClassName?: string // icon 自定义样式
  onIconClick?: () => void // 点击 icon 图标的回调函数
}

/**
 * 自定义封装 ICON
 *  */
function AppIcon(props: iconProps) {
  const { iconName, customClassName, onIconClick } = props
  const handleIcon = () => onIconClick?.()
  return (
    <span className={customClassName}>
      <i className={`iconfont ${iconName}`} onClick={handleIcon}></i>
    </span>
  )
}


export default AppIcon