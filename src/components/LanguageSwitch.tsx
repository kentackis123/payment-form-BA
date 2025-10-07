import { useTranslation } from 'react-i18next'
import { Radio } from 'antd'

const LanguageSwitch = () => {
  const { i18n } = useTranslation()

  return (
    <div className="mb-5">
      <Radio.Group
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        buttonStyle="solid"
      >
        <Radio.Button value="en">EN</Radio.Button>
        <Radio.Button value="lt">LT</Radio.Button>
      </Radio.Group>
    </div>
  )
}

export default LanguageSwitch
