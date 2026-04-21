THIS_DIR:=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))
FAKEHTTP_PKG_VERSION:=0.0.0
-include $(THIS_DIR)/../version.mk

include $(TOPDIR)/rules.mk

PKG_VERSION:=$(FAKEHTTP_PKG_VERSION)
PKG_RELEASE:=1
PKG_LICENSE:=GPL-3.0-only
PKG_MAINTAINER:=MikeWang <https://github.com/MikeWang000000>

PKG_NAME:=luci-app-fakehttp

LUCI_TITLE:=LuCI support for FakeHTTP
LUCI_DEPENDS:=+fakehttp +luci-base
LUCI_PKGARCH:=all
LUCI_DESCRIPTION:=LuCI web interface for configuring and monitoring the FakeHTTP service.

ifneq ($(wildcard ../../luci.mk),)
  include ../../luci.mk
else
  include $(TOPDIR)/feeds/luci/luci.mk
endif

# call BuildPackage - OpenWrt buildroot signature
