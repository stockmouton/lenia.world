###
# Articles
###
ARTICLES_DIR = static/blog
ARTICLES := $(filter-out $(ARTICLES_DIR)/README.md,$(shell find $(ARTICLES_DIR) -name '*.md'))

.PHONY: articles

articles: $(ARTICLES)
	$(foreach file,$^,pandoc \
		--standalone \
		--mathjax \
		--highlight-style espresso \
		-f markdown \
		-t html \
		--metadata title="$(notdir $(basename $(file)))" \
		--metadata date="`date +%D`" \
		$(file) -o $(file:.md=.html);\
	)