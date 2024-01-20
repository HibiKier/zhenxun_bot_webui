import Vue from "vue"
import SvgIcon from "../../components/SvgIcon/SvgIcon.vue"

Vue.component("SvgIcon", SvgIcon)

const req = require.context("@/assets/icons/svg", false, /\.svg$/)
const vscodeIconReq = require.context(
  "@/assets/icons/svg/vscode-icons",
  false,
  /\.svg$/
)
const requireAll = (requireContext) => {
  // requireContext.keys()数据：['./404.svg', './agency.svg', './det.svg', './user.svg']
  requireContext.keys().map(requireContext)
}
requireAll(req)
requireAll(vscodeIconReq)
