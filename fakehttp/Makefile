THIS_DIR:=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))
FAKEHTTP_PKG_VERSION:=0.0.0
-include $(THIS_DIR)/../version.mk

include $(TOPDIR)/rules.mk

PKG_NAME:=fakehttp
PKG_VERSION:=$(FAKEHTTP_PKG_VERSION)
PKG_RELEASE:=1

PKG_LICENSE:=GPL-3.0-only
PKG_LICENSE_FILES:=LICENSE
PKG_MAINTAINER:=MikeWang <https://github.com/MikeWang000000>

include $(INCLUDE_DIR)/package.mk

define Package/fakehttp
  SECTION:=net
  CATEGORY:=Network
  TITLE:=Obfuscate TCP connections as HTTP via NFQUEUE
  URL:=https://github.com/MikeWang000000/FakeHTTP
  DEPENDS:=+libnetfilter-queue +libnfnetlink +libmnl +kmod-nfnetlink-queue +kmod-nft-queue +nftables
endef

define Package/fakehttp/description
  Obfuscate TCP connections into HTTP or HTTPS traffic using Netfilter Queue.
  This package installs the FakeHTTP binary, init script, and UCI config file.
endef

define Package/fakehttp/conffiles
/etc/config/fakehttp
endef

define Build/Prepare
	$(RM) -r $(PKG_BUILD_DIR)
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
	$(CP) $(CURDIR)/../src $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../include $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../Makefile $(PKG_BUILD_DIR)/
	$(CP) $(CURDIR)/../LICENSE $(PKG_BUILD_DIR)/
endef

define Build/Compile
	$(MAKE) -C $(PKG_BUILD_DIR) \
		$(TARGET_CONFIGURE_OPTS) \
		CROSS_PREFIX="$(TARGET_CROSS)" \
		CFLAGS="$(TARGET_CFLAGS)" \
		LDFLAGS="$(TARGET_LDFLAGS)" \
		VERSION="$(PKG_VERSION)"
endef

define Package/fakehttp/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/build/fakehttp $(1)/usr/bin/fakehttp

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/fakehttp.config $(1)/etc/config/fakehttp

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/fakehttp.init $(1)/etc/init.d/fakehttp
endef

$(eval $(call BuildPackage,fakehttp))
