THIS_DIR:=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))
FAKEHTTP_PKG_VERSION:=0.0.0
-include $(THIS_DIR)/../version.mk

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-i18n-fakehttp-zh-cn
PKG_VERSION:=$(FAKEHTTP_PKG_VERSION)
PKG_RELEASE:=1
PKG_LICENSE:=GPL-3.0-only
PKG_MAINTAINER:=MikeWang <https://github.com/MikeWang000000>
PKG_BUILD_DEPENDS:=luci-base/host

include $(INCLUDE_DIR)/package.mk

define Package/luci-i18n-fakehttp-zh-cn
  SECTION:=luci
  CATEGORY:=LuCI
  TITLE:=luci-app-fakehttp - Simplified Chinese translation
  PKGARCH:=all
  DEPENDS:=+luci-app-fakehttp
endef

define Package/luci-i18n-fakehttp-zh-cn/description
  Simplified Chinese translation for luci-app-fakehttp.
endef

define Build/Compile
endef

define Package/luci-i18n-fakehttp-zh-cn/install
	$(INSTALL_DIR) $(1)/usr/lib/lua/luci/i18n
	$(STAGING_DIR_HOSTPKG)/bin/po2lmo ./po/zh_Hans/fakehttp.po \
		$(1)/usr/lib/lua/luci/i18n/fakehttp.zh-cn.lmo
endef

$(eval $(call BuildPackage,luci-i18n-fakehttp-zh-cn))
